import type { ModelStatus, Prediction } from '../types/prediction'

interface PredictionPanelProps {
  prediction: Prediction | null
  modelStatus: ModelStatus
  modelError: string | null
}

function PredictionPanel({
  prediction,
  modelStatus,
  modelError,
}: PredictionPanelProps) {
  const percentage = prediction
    ? `${Math.round(prediction.probability * 100)}%`
    : '--'

  let predictionLabel = prediction?.className ?? 'Waiting for camera'
  let helperText = 'Show a gesture to begin'

  if (modelStatus === 'loading') {
    predictionLabel = 'Loading model...'
    helperText = 'Predictions will start automatically'
  }

  if (modelStatus === 'error') {
    predictionLabel = 'Model error'
    helperText = modelError ?? 'The model could not be loaded'
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Recognition
          </p>
          <h2 className="mt-1 font-semibold text-zinc-100">
            Current Prediction
          </h2>
        </div>
        <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Live
        </span>
      </div>

      <div className="flex min-h-28 items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4">
        <div className="min-w-0">
          <p className="text-xs text-zinc-500">Gesture detected</p>
          <p className="mt-2 truncate text-lg font-semibold text-zinc-200">
            {predictionLabel}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
            {helperText}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-zinc-500">Confidence</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-violet-300">
            {modelStatus === 'ready' ? percentage : '--'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PredictionPanel
