export const gestureNames = [
  'CLOSED_FIST',
  'PEACE_SIGN',
  'OPEN_PALM',
  'NEUTRAL',
] as const

export type GestureName = (typeof gestureNames)[number]

// The exported model's first two output indices are reversed relative to the
// gesture names. Normalize them before presenting a prediction or executing it.
const modelOutputToGesture: Record<string, GestureName> = {
  CLOSED_FIST: 'PEACE_SIGN',
  PEACE_SIGN: 'CLOSED_FIST',
  OPEN_PALM: 'OPEN_PALM',
  NEUTRAL: 'NEUTRAL',
}

export type GestureCommand = 'previous' | 'next' | 'toggle-details' | null

export interface GestureInfo {
  name: string
  action: string
  description: string
  command: GestureCommand
}

export const gestureInfo: Record<GestureName, GestureInfo> = {
  CLOSED_FIST: {
    name: 'Closed fist',
    action: 'Previous slide',
    description: 'Go back one slide.',
    command: 'previous',
  },
  PEACE_SIGN: {
    name: 'Peace sign',
    action: 'Next slide',
    description: 'Advance one slide.',
    command: 'next',
  },
  OPEN_PALM: {
    name: 'Open palm',
    action: 'Show or hide details',
    description: 'Toggle the extra details for the current slide.',
    command: 'toggle-details',
  },
  NEUTRAL: {
    name: 'Neutral',
    action: 'No action',
    description: 'Release your hand before making another gesture.',
    command: null,
  },
}

export function normalizeModelGesture(className: string): string {
  return modelOutputToGesture[className] ?? className
}

export function getGestureInfo(className: string): GestureInfo | null {
  return Object.hasOwn(gestureInfo, className)
    ? gestureInfo[className as GestureName]
    : null
}
