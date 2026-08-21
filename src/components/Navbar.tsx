interface NavbarProps {
  isModelReady: boolean
}

function Navbar({ isModelReady }: NavbarProps) {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5.75h14v9.5H12l-4.5 3v-3H5v-9.5Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 9 3.5 1.75-3.5 1.75V9Z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold tracking-tight text-zinc-100">
              GestureDeck
            </p>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Gesture-controlled presentation
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-400"
          role="status"
        >
          <span
            className={`size-2 rounded-full ${
              isModelReady ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          {isModelReady ? 'Model ready' : 'Model not loaded'}
        </div>
      </div>
    </header>
  )
}

export default Navbar
