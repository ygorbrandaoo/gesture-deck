export interface Slide {
  eyebrow: string
  title: string
  subtitle: string
  description: string
  detail: string
  visual: 'intro' | 'flow' | 'gestures' | 'reliability' | 'finish'
}

export const slides: Slide[] = [
  {
    eyebrow: 'Human-computer interaction',
    title: 'The future is touchless.',
    subtitle: 'Present naturally. Stay focused on your audience.',
    description:
      'GestureDeck turns simple hand movements into presentation controls using your webcam and machine learning.',
    detail:
      'The goal is a fluid experience where the presenter never needs to return to the keyboard.',
    visual: 'intro',
  },
  {
    eyebrow: 'Simple by design',
    title: 'One gesture. One command.',
    subtitle: 'A direct path from movement to action.',
    description:
      'Each webcam frame will be classified by a model trained with Google Teachable Machine.',
    detail:
      'Only stable predictions above a confidence threshold will be allowed to control the presentation.',
    visual: 'flow',
  },
  {
    eyebrow: 'Gesture vocabulary',
    title: 'Four clear intents.',
    subtitle: 'A small set of gestures keeps control predictable.',
    description:
      'Move backward, move forward, stop the camera, or remain neutral without triggering an action.',
    detail:
      'The final class names may change after the dataset and trained model are evaluated.',
    visual: 'gestures',
  },
  {
    eyebrow: 'Reliable interaction',
    title: 'Designed for confidence.',
    subtitle: 'A single uncertain frame should never change a slide.',
    description:
      'Confidence, gesture stability, and a short cooldown will work together before an action is executed.',
    detail:
      'These validation rules will be implemented when the machine-learning model is integrated.',
    visual: 'reliability',
  },
  {
    eyebrow: 'GestureDeck',
    title: 'Ready for the next slide.',
    subtitle: 'A focused interface prepared for machine learning.',
    description:
      'The presentation experience is ready. The next step is training and connecting the gesture model.',
    detail:
      'Once integrated, live predictions will replace the initial empty state in the control panel.',
    visual: 'finish',
  },
]
