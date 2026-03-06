'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useOnlineStatus() {
  const setOffline = useAppStore((state) => state.setOffline);

  React.useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline]);

  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}