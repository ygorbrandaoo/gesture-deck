export const gestureNames = [
  'CLOSED_FIST',
  'PEACE_SIGN',
  'OPEN_PALM',
  'BACKGROUND',
] as const

export type GestureName = (typeof gestureNames)[number]

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
  BACKGROUND: {
    name: 'Background',
    action: 'No action',
    description: 'Move your hand away before making another gesture.',
    command: null,
  },
}

export function getGestureInfo(className: string): GestureInfo | null {
  return Object.hasOwn(gestureInfo, className)
    ? gestureInfo[className as GestureName]
    : null
}
