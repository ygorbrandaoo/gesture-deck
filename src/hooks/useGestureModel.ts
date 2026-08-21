import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import type { ModelStatus, Prediction } from '../types/prediction'

export const CONFIDENCE_THRESHOLD = 0.85
export const REQUIRED_STABLE_FRAMES = 5
export const REQUIRED_RELEASE_FRAMES = 5
export const ACTION_COOLDOWN_MS = 1200

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
  currentPrediction: Prediction | null
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
  const [currentPrediction, setCurrentPrediction] =
    useState<Prediction | null>(null)
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
    let stableClass = ''
    let stableFrames = 0
    let releaseFrames = 0
    let activeGesture = ''
    let lastActionTime = 0

    function validateGesture(prediction: Prediction) {
      const isActionableGesture =
        prediction.className !== 'BACKGROUND' &&
        prediction.probability >= CONFIDENCE_THRESHOLD

      if (!isActionableGesture) {
        stableClass = ''
        stableFrames = 0
        releaseFrames += 1

        if (releaseFrames >= REQUIRED_RELEASE_FRAMES) {
          activeGesture = ''
        }
        return
      }

      releaseFrames = 0

      if (prediction.className === stableClass) {
        stableFrames += 1
      } else {
        stableClass = prediction.className
        stableFrames = 1
      }

      if (
        stableFrames < REQUIRED_STABLE_FRAMES ||
        prediction.className === activeGesture
      ) {
        return
      }

      const cooldownFinished =
        Date.now() - lastActionTime >= ACTION_COOLDOWN_MS

      if (cooldownFinished) {
        onGestureRef.current(prediction.className)
        activeGesture = prediction.className
        lastActionTime = Date.now()
        stableFrames = 0
      }
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

          const topPrediction = nextPredictions.reduce((highest, prediction) =>
            prediction.probability > highest.probability ? prediction : highest,
          )

          setPredictions(nextPredictions)
          setCurrentPrediction(topPrediction)
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
    }
  }, [model, videoElement])

  useEffect(() => {
    return () => model?.dispose()
  }, [model])

  return {
    modelStatus,
    modelError,
    predictions: videoElement ? predictions : [],
    currentPrediction: videoElement ? currentPrediction : null,
  }
}
