function CameraPanel() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Input device
          </p>
          <h2 className="mt-1 font-semibold text-zinc-100">Camera</h2>
        </div>
        <span className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="size-2 rounded-full bg-zinc-600" />
          Starting
        </span>
      </div>

      <div className="flex aspect-video items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-500">
        Preparing camera...
      </div>
    </section>
  )
}

export default CameraPanel
