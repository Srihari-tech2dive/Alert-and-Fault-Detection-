'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, Settings, Wifi, WifiOff, Bell } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeuButton } from '@/components/ui/NeuButton';
import { useAppStore } from '@/store/useAppStore';
import type { ViewMode } from '@/types/alert';

export function Navbar() {
  const { viewMode, setViewMode, isOffline, alerts } = useAppStore();
  const unackCount = alerts.filter((a) => !a.acknowledged && !a.resolved).length;

  const tabs: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'DRIVER', icon: <Car className="w-4 h-4" />, label: 'Driver' },
    { mode: 'MECHANIC', icon: <Wrench className="w-4 h-4" />, label: 'Mechanic' },
    { mode: 'TUNING', icon: <Settings className="w-4 h-4" />, label: 'Tuning' },
  ];

  return (
    <GlassPanel variant="elevated" className="sticky top-0 z-40 rounded-none border-x-0 border-t-0">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">VehicleAlert</h1>
            <p className="text-xs text-white/50">Fault Detection System</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5">
          {tabs.map((tab) => (
            <NeuButton
              key={tab.mode}
              variant={viewMode === tab.mode ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode(tab.mode)}
              icon={tab.icon}
            >
              <span className="hidden sm:inline">{tab.label}</span>
            </NeuButton>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          {isOffline ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-sm">
              <WifiOff className="w-4 h-4" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 text-sm">
              <Wifi className="w-4 h-4" />
              <span className="hidden sm:inline">Connected</span>
            </div>
          )}
          {unackCount > 0 && (
            <div className="relative">
              <NeuButton variant="ghost" size="sm" icon={<Bell className="w-4 h-4" />}>
                <span className="sr-only">Notifications</span>
              </NeuButton>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unackCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}