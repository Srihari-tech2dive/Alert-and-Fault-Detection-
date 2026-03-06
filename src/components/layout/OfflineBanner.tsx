'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, CloudOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function OfflineBanner() {
  const { showOfflineBanner, isOffline } = useAppStore();

  if (!showOfflineBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-amber-500/20 border-b border-amber-500/30 overflow-hidden"
      >
        <div className="flex items-center justify-center gap-3 py-2 px-4">
          <WifiOff className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-100">
            You're offline. Alerts will be queued and synced when reconnected.
          </span>
          <CloudOff className="w-4 h-4 text-amber-400/50" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}