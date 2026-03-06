'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronRight,
  Clock,
  Wrench,
  Gauge,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlertPayload } from '@/types/alert';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeuButton } from '@/components/ui/NeuButton';
import { useHaptic } from '@/hooks/useHaptic';

interface AlertCardProps {
  alert: AlertPayload;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onClick?: (alert: AlertPayload) => void;
  compact?: boolean;
}

const priorityConfig = {
  CRITICAL: {
    icon: AlertTriangle,
    bgClass: 'bg-red-500/20 border-red-500/50',
    textClass: 'text-red-100',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    badgeClass: 'bg-red-500',
    label: 'Critical',
  },
  WARNING: {
    icon: AlertCircle,
    bgClass: 'bg-amber-500/20 border-amber-500/50',
    textClass: 'text-amber-100',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    badgeClass: 'bg-amber-500',
    label: 'Warning',
  },
  ADVISORY: {
    icon: Info,
    bgClass: 'bg-blue-500/20 border-blue-500/50',
    textClass: 'text-blue-100',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    badgeClass: 'bg-blue-500',
    label: 'Advisory',
  },
  INFO: {
    icon: CheckCircle,
    bgClass: 'bg-gray-500/20 border-gray-500/50',
    textClass: 'text-gray-100',
    glowColor: 'rgba(107, 114, 128, 0.2)',
    badgeClass: 'bg-gray-500',
    label: 'Info',
  },
};

const sourceIcons = {
  DTC: Wrench,
  ML_PREDICTION: Zap,
  BEHAVIOR: Gauge,
  MANUAL: Info,
  OBD: Gauge,
};

export function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
  onClick,
  compact = false,
}: AlertCardProps) {
  const { triggerAction } = useHaptic();
  const config = priorityConfig[alert.priority];
  const Icon = config.icon;
  const SourceIcon = sourceIcons[alert.source];

  const handleClick = () => {
    triggerAction('buttonPress');
    onClick?.(alert);
  };

  const handleAcknowledge = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerAction('success');
    onAcknowledge?.(alert.id);
  };

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerAction('success');
    onResolve?.(alert.id);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl cursor-pointer',
          'border backdrop-blur-sm transition-all duration-200',
          config.bgClass,
          alert.acknowledged && 'opacity-60'
        )}
        onClick={handleClick}
      >
        <div className={cn('p-1.5 rounded-lg', config.bgClass)}>
          <Icon className={cn('w-4 h-4', config.textClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">{alert.title}</p>
          <p className="text-xs text-white/60">{formatTimestamp(alert.timestamp)}</p>
        </div>
        {!alert.acknowledged && (
          <div className={cn('w-2 h-2 rounded-full', config.badgeClass)} />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassPanel
        glow={alert.priority === 'CRITICAL'}
        glowColor={config.glowColor}
        className={cn(
          'border-2 transition-all duration-300',
          config.bgClass,
          alert.acknowledged && 'opacity-70',
          alert.resolved && 'opacity-50'
        )}
        onClick={handleClick}
      >
        {/* Priority pulse animation for critical */}
        {alert.priority === 'CRITICAL' && !alert.acknowledged && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-red-500/20"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        <div className="p-4 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <motion.div
                className={cn('p-2 rounded-xl', config.bgClass)}
                animate={
                  alert.priority === 'CRITICAL' && !alert.acknowledged
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Icon className={cn('w-5 h-5', config.textClass)} />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      config.badgeClass,
                      'text-white'
                    )}
                  >
                    {config.label}
                  </span>
                  <span className="text-xs text-white/50">{alert.source}</span>
                </div>
                <h4 className="font-semibold text-white/90 mt-1">{alert.title}</h4>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock className="w-3 h-3" />
              {formatTimestamp(alert.timestamp)}
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-white/70 mb-3">{alert.message}</p>

          {/* Technical Data */}
          {alert.technicalData?.dtcCode && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/5">
              <SourceIcon className="w-4 h-4 text-white/60" />
              <span className="text-sm font-mono text-white/80">
                {alert.technicalData.dtcCode}
              </span>
              <span className="text-xs text-white/50">
                ({alert.technicalData.dtcStatus})
              </span>
            </div>
          )}

          {/* ML Metrics */}
          {alert.mlMetrics && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-xs text-white/50">Confidence</p>
                <p className="text-lg font-semibold text-white/90">
                  {Math.round(alert.mlMetrics.confidenceScore * 100)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-xs text-white/50">Trend</p>
                <p
                  className={cn(
                    'text-sm font-medium',
                    alert.mlMetrics.degradationTrend === 'CRITICAL'
                      ? 'text-red-400'
                      : alert.mlMetrics.degradationTrend === 'DECLINING'
                      ? 'text-amber-400'
                      : 'text-green-400'
                  )}
                >
                  {alert.mlMetrics.degradationTrend}
                </p>
              </div>
              {alert.mlMetrics.predictedFailureDate && (
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-xs text-white/50">Predicted</p>
                  <p className="text-xs text-white/80">
                    {new Date(alert.mlMetrics.predictedFailureDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Behavior Data */}
          {alert.behaviorData && (
            <div className="flex items-center gap-4 mb-3 p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/80">
                  {alert.behaviorData.eventType.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm text-white/60">
                Severity: {alert.behaviorData.severityScore}%
              </div>
              {alert.behaviorData.gForce && (
                <div className="text-sm text-white/60">
                  {alert.behaviorData.gForce}g
                </div>
              )}
            </div>
          )}

          {/* Action Required */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
            <ChevronRight className="w-4 h-4 text-white/60" />
            <p className="text-sm font-medium text-white/80">{alert.actionRequired}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!alert.acknowledged && (
              <NeuButton
                variant="primary"
                size="sm"
                onClick={handleAcknowledge}
                className="flex-1"
              >
                Acknowledge
              </NeuButton>
            )}
            {!alert.resolved && (
              <NeuButton
                variant="success"
                size="sm"
                onClick={handleResolve}
                className="flex-1"
              >
                Mark Resolved
              </NeuButton>
            )}
            {alert.resolved && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Resolved
              </div>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

// Fullscreen Critical Alert Modal
interface CriticalAlertModalProps {
  alert: AlertPayload | null;
  onAcknowledge: (id: string) => void;
}

export function CriticalAlertModal({ alert, onAcknowledge }: CriticalAlertModalProps) {
  const { triggerAlert } = useHaptic();

  React.useEffect(() => {
    if (alert && !alert.acknowledged) {
      triggerAlert('CRITICAL');
    }
  }, [alert, triggerAlert]);

  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md"
        >
          <AlertCard alert={alert} onAcknowledge={onAcknowledge} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}