'use client';

// Vibration patterns for different alert priorities
const HAPTIC_PATTERNS = {
  CRITICAL: [200, 100, 200, 100, 200],
  WARNING: [100, 50, 100],
  ADVISORY: [50],
  INFO: [],
} as const;

const HAPTIC_ACTION_PATTERNS = {
  buttonPress: [10],
  success: [50, 30, 50],
  error: [100, 30, 100, 30, 100],
  toggle: [20],
  slide: [5],
} as const;

type AlertPriority = keyof typeof HAPTIC_PATTERNS;
type ActionType = keyof typeof HAPTIC_ACTION_PATTERNS;

export function useHaptic() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = (pattern: number | number[]) => {
    if (isSupported) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Haptic feedback not supported');
      }
    }
  };

  const triggerAlert = (priority: AlertPriority) => {
    const pattern = [...HAPTIC_PATTERNS[priority]]; // Convert to mutable array
    if (pattern.length > 0) {
      vibrate(pattern);
    }
  };

  const triggerAction = (action: ActionType) => {
    vibrate([...HAPTIC_ACTION_PATTERNS[action]]); // Convert to mutable array
  };

  const customVibrate = (pattern: number | number[]) => {
    vibrate(Array.isArray(pattern) ? [...pattern] : pattern);
  };

  const stopVibration = () => {
    if (isSupported) {
      navigator.vibrate(0);
    }
  };

  return {
    isSupported,
    triggerAlert,
    triggerAction,
    customVibrate,
    stopVibration,
  };
}