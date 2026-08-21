export interface Prediction {
  className: string
  probability: number
}

export type ModelStatus = 'loading' | 'ready' | 'error'
