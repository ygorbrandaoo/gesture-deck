import { useState } from 'react'
import CameraPanel from './components/CameraPanel'
import ConfidenceList from './components/ConfidenceList'
import Navbar from './components/Navbar'
import PredictionPanel from './components/PredictionPanel'
import Presentation from './components/Presentation'
import { slides } from './data/slides'
import type { Prediction } from './types/prediction'

const initialPredictions: Prediction[] = [
  { className: 'LEFT', probability: 0 },
  { className: 'RIGHT', probability: 0 },
  { className: 'ACTION', probability: 0 },
  { className: 'NEUTRAL', probability: 0 },
]

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const isModelReady = false
  const currentPrediction: Prediction | null = null

  function nextSlide() {
    setCurrentSlide((slide) => Math.min(slide + 1, slides.length - 1))
  }

  function previousSlide() {
    setCurrentSlide((slide) => Math.max(slide - 1, 0))
  }

  function toggleDetails() {
    setShowDetails((isVisible) => !isVisible)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar isModelReady={isModelReady} />

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
            <CameraPanel />
          </div>
          <PredictionPanel
            isModelReady={isModelReady}
            prediction={currentPrediction}
          />
          <ConfidenceList predictions={initialPredictions} />
        </aside>
      </main>
    </div>
  )
}

export default App
