import { getGestureInfo } from '../data/gestures'
import type { Prediction } from '../types/prediction'

interface ConfidenceListProps {
  cooldownRemainingMs: number
  predictions: Prediction[]
}

function ConfidenceList({
  cooldownRemainingMs,
  predictions,
}: ConfidenceListProps) {
  const isActionReady = cooldownRemainingMs === 0
  const cooldownLabel = isActionReady
    ? 'Ready'
    : `${(cooldownRemainingMs / 1000).toFixed(1)}s`

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/10 lg:p-4">
      <div className="mb-5 flex items-start justify-between gap-3 lg:mb-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Class probabilities
          </p>
          <h2 className="mt-1 font-semibold text-zinc-100">Confidence</h2>
        </div>
        <div
          aria-live="polite"
          className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-right"
        >
          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            Next action
          </p>
          <p
            className={`mt-0.5 font-mono text-xs font-medium ${
              isActionReady ? 'text-emerald-300' : 'text-violet-300'
            }`}
          >
            {cooldownLabel}
          </p>
        </div>
      </div>

      {predictions.length > 0 ? (
        <div className="space-y-4 lg:space-y-3">
          {predictions.map((prediction) => {
            const percentage = Math.round(prediction.probability * 100)
            const gesture = getGestureInfo(prediction.className)

            return (
              <div key={prediction.className}>
                <div className="mb-2 flex items-start justify-between gap-3 lg:mb-1">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-zinc-400">
                      {prediction.className}
                    </p>
                    {gesture && (
                      <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                        {gesture.name} - {gesture.action}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-xs text-zinc-500">
                    {percentage}%
                  </span>
                </div>
                <div
                  aria-label={`${prediction.className}: ${percentage}%`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={percentage}
                  className="h-1.5 overflow-hidden rounded-full bg-zinc-800"
                  role="progressbar"
                >
                  <div
                    className="h-full rounded-full bg-violet-400 transition-[width] duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-4 py-6 text-center text-xs text-zinc-600">
          Waiting for live predictions...
        </div>
      )}

      <p className="mt-5 border-t border-zinc-800 pt-4 text-xs leading-5 text-zinc-600 lg:mt-3 lg:pt-3">
        Probabilities are generated locally from the live webcam feed.
      </p>
    </section>
  )
}

export default ConfidenceList
