import { useEffect, useRef, useState } from 'react'

type CameraStatus =
  | 'starting'
  | 'stopped'
  | 'active'
  | 'denied'
  | 'unavailable'
  | 'unsupported'
  | 'error'

const statusLabels: Record<CameraStatus, string> = {
  starting: 'Starting',
  stopped: 'Camera off',
  active: 'Camera active',
  denied: 'Access denied',
  unavailable: 'Not available',
  unsupported: 'Unsupported',
  error: 'Camera error',
}

function getCameraError(error: unknown): CameraStatus {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return 'denied'
    }

    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'unavailable'
    }
  }

  return 'error'
}

interface CameraPanelProps {
  isEnabled: boolean
  onVideoReady: (video: HTMLVideoElement | null) => void
}

function CameraPanel({ isEnabled, onVideoReady }: CameraPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<CameraStatus>('starting')
  const [cameraAttempt, setCameraAttempt] = useState(0)

  useEffect(() => {
    const videoElement = videoRef.current
    let stream: MediaStream | null = null
    let isCancelled = false

    async function startCamera() {
      if (!isEnabled) {
        setStatus('stopped')
        onVideoReady(null)
        return
      }

      setStatus('starting')

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: 'user' },
        })

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        if (videoElement) {
          videoElement.srcObject = stream
          onVideoReady(videoElement)
        }

        setStatus('active')
      } catch (error: unknown) {
        if (!isCancelled) {
          setStatus(getCameraError(error))
        }
      }
    }

    void startCamera()

    return () => {
      isCancelled = true
      stream?.getTracks().forEach((track) => track.stop())

      if (videoElement) {
        videoElement.srcObject = null
      }

      onVideoReady(null)
    }
  }, [cameraAttempt, isEnabled, onVideoReady])

  const errorMessages: Partial<Record<CameraStatus, string>> = {
    denied:
      'Camera access was denied. Allow permission in your browser and try again.',
    unavailable: 'No webcam was found. Connect a camera and try again.',
    unsupported: 'Camera access is not supported by this browser.',
    error: 'The camera could not be started. Check whether it is in use.',
  }

  const errorMessage = errorMessages[status]
  const canRetry =
    status === 'denied' || status === 'unavailable' || status === 'error'

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/10 lg:p-4">
      <div className="mb-4 flex items-center justify-between lg:mb-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Input device
          </p>
          <h2 className="mt-1 font-semibold text-zinc-100">Camera</h2>
        </div>
        <span
          className={`flex items-center gap-2 text-xs ${
            status === 'active' ? 'text-emerald-300' : 'text-zinc-500'
          }`}
          role="status"
        >
          <span
            className={`size-2 rounded-full ${
              status === 'active'
                ? 'bg-emerald-400'
                : status === 'starting'
                  ? 'animate-pulse bg-amber-400'
                  : 'bg-zinc-600'
            }`}
          />
          {statusLabels[status]}
        </span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <video
          aria-label="Live webcam preview"
          autoPlay
          className={`size-full scale-x-[-1] object-cover transition-opacity duration-300 ${
            status === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          playsInline
          ref={videoRef}
        />

        {status !== 'active' && (
          <div
            aria-live="polite"
            className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center"
          >
            {status === 'starting' ? (
              <>
                <span className="mb-3 size-5 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-300" />
                <p className="text-sm text-zinc-400">Requesting camera access...</p>
              </>
            ) : status === 'stopped' ? (
              <p className="text-sm text-zinc-400">Camera is off.</p>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  className="mb-3 size-6 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="m4 4 16 16M10 8H6.5A2.5 2.5 0 0 0 4 10.5v5A2.5 2.5 0 0 0 6.5 18h9M14 8h1.5a2.5 2.5 0 0 1 2.5 2.5v.5l2-1v6l-2-1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="max-w-64 text-xs leading-5 text-zinc-500">
                  {errorMessage}
                </p>
                {canRetry && (
                  <button
                    className="mt-3 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
                    onClick={() => setCameraAttempt((attempt) => attempt + 1)}
                    type="button"
                  >
                    Try again
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-zinc-600 lg:hidden">
        Video stays in your browser and is not recorded or uploaded.
      </p>
    </section>
  )
}

export default CameraPanel
