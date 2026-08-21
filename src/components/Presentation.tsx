import { gestureInfo, gestureNames } from '../data/gestures'
import type { Slide } from '../data/slides'

interface PresentationProps {
  slide: Slide
  currentSlide: number
  totalSlides: number
  showDetails: boolean
  onNext: () => void
  onPrevious: () => void
  onToggleDetails: () => void
}

interface SlideVisualProps {
  type: Slide['visual']
}

function SlideVisual({ type }: SlideVisualProps) {
  if (type === 'flow') {
    return (
      <div className="flex w-full items-center justify-center gap-2 font-mono text-[10px] text-zinc-400 sm:gap-3 sm:text-xs">
        {['Webcam', 'Model', 'Action'].map((item, index) => (
          <div className="contents" key={item}>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 sm:px-4">
              {item}
            </div>
            {index < 2 && <span className="text-violet-400">→</span>}
          </div>
        ))}
      </div>
    )
  }

  if (type === 'gestures') {
    return (
      <div className="grid w-full grid-cols-2 gap-2">
        {gestureNames.map((gesture, index) => (
          <div
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-3"
            key={gesture}
          >
            <span className="font-mono text-[10px] text-zinc-500">
              0{index + 1}
            </span>
            <p className="mt-3 font-mono text-xs text-violet-300">{gesture}</p>
            <p className="mt-1 text-[10px] text-zinc-400">
              {gestureInfo[gesture].action}
            </p>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'reliability') {
    return (
      <div className="w-full space-y-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Confidence</span>
          <span className="font-mono text-violet-300">92%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-[92%] rounded-full bg-violet-400" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] text-zinc-500">
          <span>Threshold</span>
          <span>Stability</span>
          <span>Cooldown</span>
        </div>
      </div>
    )
  }

  if (type === 'finish') {
    return (
      <div className="relative flex size-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-violet-400/20" />
        <div className="absolute inset-5 rounded-full border border-violet-400/30" />
        <div className="flex size-24 items-center justify-center rounded-full bg-violet-400 text-zinc-950 shadow-2xl shadow-violet-500/20">
          <svg
            aria-hidden="true"
            className="size-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m7 12 3 3 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex size-44 items-center justify-center">
      <div className="absolute size-44 rounded-full border border-violet-300/10 bg-violet-500/5" />
      <div className="absolute size-32 rounded-full border border-violet-300/20 bg-violet-500/10" />
      <div className="relative flex size-20 items-center justify-center rounded-2xl border border-violet-300/30 bg-zinc-900 text-violet-300 shadow-2xl shadow-violet-500/20">
        <svg
          aria-hidden="true"
          className="size-9"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.5 11V7.5a1.5 1.5 0 0 1 3 0V10m0-2.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0v4m0-2a1.5 1.5 0 0 1 3 0v2.5c0 4.14-3.36 7.5-7.5 7.5h-.63a7 7 0 0 1-4.95-2.05L4.3 15.33a1.65 1.65 0 0 1 2.33-2.33l1.87 1.87V11Z"
          />
        </svg>
      </div>
    </div>
  )
}

function Presentation({
  slide,
  currentSlide,
  totalSlides,
  showDetails,
  onNext,
  onPrevious,
  onToggleDetails,
}: PresentationProps) {
  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === totalSlides - 1

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 shadow-2xl shadow-black/20 sm:p-4 lg:h-full">
      <div className="mb-3 flex items-center justify-between px-1 text-xs text-zinc-500">
        <span className="font-medium text-zinc-400">Presentation</span>
        <span className="font-mono">
          Slide {currentSlide + 1} / {totalSlides}
        </span>
      </div>

      <article className="relative flex min-h-[520px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-7 sm:p-10 lg:min-h-0 lg:flex-1 lg:p-14">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_240px] xl:gap-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
              {slide.eyebrow}
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-5xl xl:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 text-lg leading-7 text-zinc-300 sm:text-xl">
              {slide.subtitle}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
              {slide.description}
            </p>

            {showDetails && (
              <div className="mt-7 max-w-xl rounded-xl border border-violet-400/20 bg-violet-500/5 p-4 text-sm leading-6 text-violet-100/70">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-violet-300">
                  Additional details
                </span>
                {slide.detail}
              </div>
            )}
          </div>

          <div className="flex min-h-44 items-center justify-center rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5">
            <SlideVisual type={slide.visual} />
          </div>
        </div>

        <div
          aria-label={`Presentation progress: slide ${currentSlide + 1} of ${totalSlides}`}
          aria-valuemax={totalSlides}
          aria-valuemin={1}
          aria-valuenow={currentSlide + 1}
          className="absolute bottom-5 left-7 right-7 h-1 overflow-hidden rounded-full bg-zinc-800 sm:left-10 sm:right-10 lg:left-14 lg:right-14"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-violet-400 transition-[width] duration-500 ease-out"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </article>

      <div className="flex flex-col-reverse gap-3 px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onToggleDetails}
          type="button"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isFirstSlide}
            onClick={onPrevious}
            type="button"
          >
            ← Previous
          </button>
          <button
            className="rounded-lg bg-violet-400 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            disabled={isLastSlide}
            onClick={onNext}
            type="button"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Presentation
