import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import type { ModelStatus, Prediction } from '../types/prediction'

export const CONFIDENCE_THRESHOLD = 0.85
export const PREDICTION_SMOOTHING_FACTOR = 0.2
export const REQUIRED_STABLE_MS = 650
export const REQUIRED_RELEASE_FRAMES = 5
export const ACTION_COOLDOWN_MS = 2000

const MODEL_URL = '/model/model.json'
const METADATA_URL = '/model/metadata.json'

interface ModelMetadata {
  labels: string[]
  imageSize?: number
}

interface GestureModel {
  predict: (video: HTMLVideoElement) => Promise<Prediction[]>
  dispose: () => void
}

interface GestureModelResult {
  modelStatus: ModelStatus
  modelError: string | null
  predictions: Prediction[]
  cooldownRemainingMs: number
}

function isModelMetadata(value: unknown): value is ModelMetadata {
  if (!value || typeof value !== 'object') {
    return false
  }

  const metadata = value as Record<string, unknown>
  return (
    Array.isArray(metadata.labels) &&
    metadata.labels.length > 0 &&
    metadata.labels.every((label) => typeof label === 'string')
  )
}

function drawVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  imageSize: number,
) {
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas is not available in this browser.')
  }

  const sourceSize = Math.min(video.videoWidth, video.videoHeight)
  const sourceX = (video.videoWidth - sourceSize) / 2
  const sourceY = (video.videoHeight - sourceSize) / 2

  canvas.width = imageSize
  canvas.height = imageSize

  context.save()
  context.scale(-1, 1)
  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    -imageSize,
    0,
    imageSize,
    imageSize,
  )
  context.restore()
}

async function loadGestureModel(): Promise<GestureModel> {
  const metadataResponse = await fetch(METADATA_URL)

  if (!metadataResponse.ok) {
    throw new Error(`Metadata not found at ${METADATA_URL}.`)
  }

  const metadata: unknown = await metadataResponse.json()

  if (!isModelMetadata(metadata)) {
    throw new Error('The model metadata is invalid or has no class labels.')
  }

  const modelMetadata = metadata

  await tf.ready()
  const model = await tf.loadLayersModel(MODEL_URL)
  const imageSize = modelMetadata.imageSize ?? 224
  const canvas = document.createElement('canvas')

  async function predict(video: HTMLVideoElement): Promise<Prediction[]> {
    drawVideoFrame(video, canvas, imageSize)

    const output = tf.tidy(() => {
      const pixels = tf.browser.fromPixels(canvas)
      const input = pixels.toFloat().div(127).sub(1).expandDims(0)
      const result = model.predict(input)

      return (Array.isArray(result) ? result[0] : result) as tf.Tensor
    })

    try {
      const probabilities = await output.data()

      return modelMetadata.labels.map((className, index) => ({
        className,
        probability: probabilities[index] ?? 0,
      }))
    } finally {
      output.dispose()
    }
  }

  return {
    predict,
    dispose: () => model.dispose(),
  }
}

export function useGestureModel(
  videoElement: HTMLVideoElement | null,
  onGesture: (className: string) => void,
): GestureModelResult {
  const [model, setModel] = useState<GestureModel | null>(null)
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading')
  const [modelError, setModelError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0)
  const onGestureRef = useRef(onGesture)

  useEffect(() => {
    onGestureRef.current = onGesture
  }, [onGesture])

  useEffect(() => {
    let isCancelled = false

    async function initializeModel() {
      try {
        const loadedModel = await loadGestureModel()

        if (isCancelled) {
          loadedModel.dispose()
          return
        }

        setModel(loadedModel)
        setModelStatus('ready')
      } catch (error: unknown) {
        if (isCancelled) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Unknown model loading error.'

        console.error('Could not load the gesture model:', error)
        setModelError(message)
        setModelStatus('error')
      }
    }

    void initializeModel()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!model || !videoElement) {
      return
    }

    const activeModel = model
    const activeVideo = videoElement
    let animationFrameId = 0
    let isCancelled = false
    const smoothedProbabilities = new Map<string, number>()
    let stableClass = ''
    let stableSince = 0
    let releaseFrames = 0
    let activeGesture = ''
    let lastActionTime = -ACTION_COOLDOWN_MS

    function smoothPredictions(nextPredictions: Prediction[]): Prediction[] {
      return nextPredictions.map((prediction) => {
        const previousProbability = smoothedProbabilities.get(
          prediction.className,
        )
        const probability =
          previousProbability === undefined
            ? prediction.probability
            : previousProbability +
              (prediction.probability - previousProbability) *
                PREDICTION_SMOOTHING_FACTOR

        smoothedProbabilities.set(prediction.className, probability)
        return { ...prediction, probability }
      })
    }

    function updateCooldown(now: number) {
      const remaining = Math.max(
        0,
        ACTION_COOLDOWN_MS - (now - lastActionTime),
      )
      const roundedRemaining = Math.ceil(remaining / 100) * 100

      setCooldownRemainingMs((currentRemaining) =>
        currentRemaining === roundedRemaining ? currentRemaining : roundedRemaining,
      )
    }

    function validateGesture(prediction: Prediction) {
      const now = performance.now()
      updateCooldown(now)
      const isActionableGesture =
        prediction.className !== 'BACKGROUND' &&
        prediction.probability >= CONFIDENCE_THRESHOLD

      if (!isActionableGesture) {
        stableClass = ''
        stableSince = 0
        releaseFrames += 1

        if (releaseFrames >= REQUIRED_RELEASE_FRAMES) {
          activeGesture = ''
        }
        return
      }

      releaseFrames = 0

      if (prediction.className !== stableClass) {
        stableClass = prediction.className
        stableSince = now
      }

      if (
        now - stableSince < REQUIRED_STABLE_MS ||
        prediction.className === activeGesture ||
        now - lastActionTime < ACTION_COOLDOWN_MS
      ) {
        return
      }

      onGestureRef.current(prediction.className)
      activeGesture = prediction.className
      lastActionTime = now
      setCooldownRemainingMs(ACTION_COOLDOWN_MS)
    }

    async function predictFrame() {
      if (
        activeVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        activeVideo.videoWidth > 0
      ) {
        try {
          const nextPredictions = await activeModel.predict(activeVideo)

          if (isCancelled) {
            return
          }

          const stablePredictions = smoothPredictions(nextPredictions)
          const topPrediction = stablePredictions.reduce(
            (highest, prediction) =>
              prediction.probability > highest.probability ? prediction : highest,
          )

          setPredictions(stablePredictions)
          validateGesture(topPrediction)
        } catch (error: unknown) {
          if (!isCancelled) {
            const message =
              error instanceof Error
                ? error.message
                : 'Unknown prediction error.'

            console.error('Could not classify the webcam frame:', error)
            setModelError(message)
            setModelStatus('error')
          }
          return
        }
      }

      if (!isCancelled) {
        animationFrameId = requestAnimationFrame(predictFrame)
      }
    }

    animationFrameId = requestAnimationFrame(predictFrame)

    return () => {
      isCancelled = true
      cancelAnimationFrame(animationFrameId)
      setCooldownRemainingMs(0)
    }
  }, [model, videoElement])

  useEffect(() => {
    return () => model?.dispose()
  }, [model])

  return {
    modelStatus,
    modelError,
    predictions: videoElement ? predictions : [],
    cooldownRemainingMs,
  }
}
