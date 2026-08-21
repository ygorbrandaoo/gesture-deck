import { gestureInfo, gestureNames } from '../data/gestures'

function GestureGuide() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Presentation controls
        </p>
        <h2 className="mt-1 font-semibold text-zinc-100">Gesture guide</h2>
      </div>

      <dl className="space-y-3">
        {gestureNames.map((gesture) => {
          const { action, name } = gestureInfo[gesture]

          return (
            <div
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-3"
              key={gesture}
            >
              <dt className="font-mono text-xs text-violet-300">{gesture}</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-200">{action}</dd>
              <dd className="mt-1 text-xs text-zinc-500">{name}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

export default GestureGuide
