import { useState } from 'react'
import CameraPanel from './components/CameraPanel'
import ConfidenceList from './components/ConfidenceList'
import Navbar from './components/Navbar'
import Presentation from './components/Presentation'
import { getGestureInfo } from './data/gestures'
import { slides } from './data/slides'
import { useGestureModel } from './hooks/useGestureModel'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [isCameraEnabled, setIsCameraEnabled] = useState(true)
  const [videoElement, setVideoElement] =
    useState<HTMLVideoElement | null>(null)

  const { modelStatus, predictions, cooldownRemainingMs } = useGestureModel(
    videoElement,
    handleGesture,
  )

  function nextSlide() {
    setCurrentSlide((slide) => Math.min(slide + 1, slides.length - 1))
  }

  function previousSlide() {
    setCurrentSlide((slide) => Math.max(slide - 1, 0))
  }

  function toggleDetails() {
    setShowDetails((isVisible) => !isVisible)
  }

  function handleGesture(className: string) {
    switch (getGestureInfo(className)?.command) {
      case 'next':
        nextSlide()
        break
      case 'previous':
        previousSlide()
        break
      case 'stop-camera':
        setIsCameraEnabled(false)
        break
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 lg:grid lg:h-dvh lg:grid-rows-[auto_minmax(0,1fr)] lg:overflow-hidden">
      <Navbar
        isCameraEnabled={isCameraEnabled}
        modelStatus={modelStatus}
        onToggleCamera={() => setIsCameraEnabled((isEnabled) => !isEnabled)}
      />

      <main className="mx-auto grid w-full max-w-[1600px] gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <Presentation
          currentSlide={currentSlide}
          onNext={nextSlide}
          onPrevious={previousSlide}
          onToggleDetails={toggleDetails}
          showDetails={showDetails}
          slide={slides[currentSlide]}
          totalSlides={slides.length}
        />

        <aside className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="sm:col-span-2 lg:col-span-1">
            <CameraPanel
              isEnabled={isCameraEnabled}
              onVideoReady={setVideoElement}
            />
          </div>
          <ConfidenceList
            cooldownRemainingMs={cooldownRemainingMs}
            predictions={predictions}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
