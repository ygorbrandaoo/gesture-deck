import { useState } from 'react'
import CameraPanel from './components/CameraPanel'
import ConfidenceList from './components/ConfidenceList'
import Navbar from './components/Navbar'
import PredictionPanel from './components/PredictionPanel'
import Presentation from './components/Presentation'
import { slides } from './data/slides'
import { useGestureModel } from './hooks/useGestureModel'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [videoElement, setVideoElement] =
    useState<HTMLVideoElement | null>(null)

  const { modelStatus, modelError, predictions, currentPrediction } =
    useGestureModel(videoElement, handleGesture)

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
    switch (className) {
      case 'PEACE_SIGN':
        nextSlide()
        break
      case 'CLOSED_FIST':
        previousSlide()
        break
      case 'OPEN_PALM':
        toggleDetails()
        break
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar modelStatus={modelStatus} />

      <main className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
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
            <CameraPanel onVideoReady={setVideoElement} />
          </div>
          <PredictionPanel
            modelError={modelError}
            modelStatus={modelStatus}
            prediction={currentPrediction}
          />
          <ConfidenceList predictions={predictions} />
        </aside>
      </main>
    </div>
  )
}

export default App
