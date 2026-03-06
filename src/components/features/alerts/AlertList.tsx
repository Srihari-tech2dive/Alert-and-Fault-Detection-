'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlertPayload, AlertPriority } from '@/types/alert';
import { AlertCard } from './AlertCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeuButton } from '@/components/ui/NeuButton';

interface AlertListProps {
  alerts: AlertPayload[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onAlertClick?: (alert: AlertPayload) => void;
  showFilters?: boolean;
  maxHeight?: string;
}

const priorityOrder: AlertPriority[] = ['CRITICAL', 'WARNING', 'ADVISORY', 'INFO'];

export function AlertList({
  alerts,
  onAcknowledge,
  onResolve,
  onAlertClick,
  showFilters = true,
  maxHeight = '600px',
}: AlertListProps) {
  const [selectedPriority, setSelectedPriority] = useState<AlertPriority | 'ALL'>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [showResolved, setShowResolved] = useState(false);

  // Get unique sources
  const sources = React.useMemo(() => {
    const uniqueSources = new Set(alerts.map((a) => a.source));
    return ['ALL', ...Array.from(uniqueSources)];
  }, [alerts]);

  // Filter alerts
  const filteredAlerts = React.useMemo(() => {
    return alerts
      .filter((alert) => {
        if (selectedPriority !== 'ALL' && alert.priority !== selectedPriority) return false;
        if (selectedSource !== 'ALL' && alert.source !== selectedSource) return false;
        if (!showResolved && alert.resolved) return false;
        return true;
      })
      .sort((a, b) => {
        const priorityDiff =
          priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [alerts, selectedPriority, selectedSource, showResolved]);

  // Count by priority
  const counts = React.useMemo(
    () => ({
      CRITICAL: alerts.filter((a) => a.priority === 'CRITICAL' && !a.resolved).length,
      WARNING: alerts.filter((a) => a.priority === 'WARNING' && !a.resolved).length,
      ADVISORY: alerts.filter((a) => a.priority === 'ADVISORY' && !a.resolved).length,
      INFO: alerts.filter((a) => a.priority === 'INFO' && !a.resolved).length,
    }),
    [alerts]
  );

  const priorityIcons = {
    CRITICAL: AlertTriangle,
    WARNING: AlertCircle,
    ADVISORY: Info,
    INFO: CheckCircle,
  };

  const priorityColors = {
    CRITICAL: 'text-red-400 bg-red-500/20',
    WARNING: 'text-amber-400 bg-amber-500/20',
    ADVISORY: 'text-blue-400 bg-blue-500/20',
    INFO: 'text-gray-400 bg-gray-500/20',
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <GlassPanel variant="subtle" className="p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/60" />
              <div className="flex gap-1">
                {(['ALL', ...priorityOrder] as const).map((priority) => {
                  const Icon = priority !== 'ALL' ? priorityIcons[priority] : null;
                  const count = priority !== 'ALL' ? counts[priority] : null;
                  return (
                    <NeuButton
                      key={priority}
                      variant={selectedPriority === priority ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedPriority(priority)}
                      className="text-xs"
                    >
                      {Icon && <Icon className="w-3 h-3" />}
                      {priority}
                      {count !== null && (
                        <span
                          className={cn(
                            'ml-1 px-1.5 rounded-full text-xs',
                            counts[priority] > 0 ? 'bg-white/20' : 'bg-transparent'
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </NeuButton>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Source:</span>
              <div className="flex gap-1">
                {sources.slice(0, 4).map((source) => (
                  <NeuButton
                    key={source}
                    variant={selectedSource === source ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedSource(source)}
                    className="text-xs"
                  >
                    {source}
                  </NeuButton>
                ))}
              </div>
            </div>

            <NeuButton
              variant={showResolved ? 'success' : 'ghost'}
              size="sm"
              onClick={() => setShowResolved(!showResolved)}
              className="ml-auto"
            >
              <CheckCircle className="w-3 h-3" />
              Resolved
            </NeuButton>
          </div>
        </GlassPanel>
      )}

      {/* Alert List */}
      <div
        className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        style={{ maxHeight }}
      >
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-white/50"
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No alerts to display</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={onAcknowledge}
                onResolve={onResolve}
                onClick={onAlertClick}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <GlassPanel variant="subtle" className="p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            {priorityOrder.map((priority) => {
              const Icon = priorityIcons[priority];
              const count = counts[priority];
              if (count === 0) return null;
              return (
                <div
                  key={priority}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                    priorityColors[priority]
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {count}
                </div>
              );
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}