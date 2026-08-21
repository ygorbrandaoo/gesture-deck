export const gestureNames = [
  'CLOSED_FIST',
  'PEACE_SIGN',
  'OPEN_PALM',
  'BACKGROUND',
  'HUMAN-FACE',
] as const

export type GestureName = (typeof gestureNames)[number]

export type GestureCommand = 'previous' | 'next' | 'stop-camera' | null

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
    action: 'Stop camera',
    description: 'Turn off the webcam feed.',
    command: 'stop-camera',
  },
  BACKGROUND: {
    name: 'Background',
    action: 'No action',
    description: 'Move your hand away before repeating the same command.',
    command: null,
  },
  'HUMAN-FACE': {
    name: 'Human face',
    action: 'No action',
    description: 'Wait for a hand gesture before running a command.',
    command: null,
  },
}

export function getGestureInfo(className: string): GestureInfo | null {
  return Object.hasOwn(gestureInfo, className)
    ? gestureInfo[className as GestureName]
    : null
}

export function hasGestureAction(className: string): boolean {
  return getGestureInfo(className)?.command != null
}
