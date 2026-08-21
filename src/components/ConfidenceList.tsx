import type { Prediction } from '../types/prediction'

interface ConfidenceListProps {
  predictions: Prediction[]
}

function ConfidenceList({ predictions }: ConfidenceListProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Class probabilities
        </p>
        <h2 className="mt-1 font-semibold text-zinc-100">Confidence</h2>
      </div>

      {predictions.length > 0 ? (
        <div className="space-y-4">
          {predictions.map((prediction) => {
            const percentage = Math.round(prediction.probability * 100)

            return (
              <div key={prediction.className}>
                <div className="mb-2 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-400">{prediction.className}</span>
                  <span className="text-zinc-500">{percentage}%</span>
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

      <p className="mt-5 border-t border-zinc-800 pt-4 text-xs leading-5 text-zinc-600">
        Probabilities are generated locally from the live webcam feed.
      </p>
    </section>
  )
}

export default ConfidenceList
