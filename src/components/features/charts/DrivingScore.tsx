'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import type { DrivingScore as DrivingScoreType } from '@/types/alert';

interface DrivingScoreGaugeProps {
  score: number;
  previousScore?: number;
  showDetails?: boolean;
  details?: DrivingScoreType;
  size?: 'sm' | 'md' | 'lg';
}

export function DrivingScoreGauge({
  score,
  previousScore,
  showDetails = true,
  details,
  size = 'md',
}: DrivingScoreGaugeProps) {
  // Calculate score category
  const getScoreCategory = (s: number) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (s >= 75) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (s >= 60) return { label: 'Fair', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const category = getScoreCategory(score);
  const change = previousScore ? score - previousScore : 0;

  // Calculate arc path for gauge
  const calculateArc = (value: number, size: number) => {
    const radius = size * 0.35;
    const startAngle = 135;
    const endAngle = 405;
    const angleRange = endAngle - startAngle;
    const currentAngle = startAngle + (value / 100) * angleRange;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (currentAngle * Math.PI) / 180;

    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);
    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);

    const largeArc = currentAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const sizes = {
    sm: { width: 120, textSize: 'text-2xl', labelSize: 'text-xs' },
    md: { width: 180, textSize: 'text-4xl', labelSize: 'text-sm' },
    lg: { width: 240, textSize: 'text-5xl', labelSize: 'text-base' },
  };

  const config = sizes[size];

  // Event type icons
  const eventIcons = {
    hardBrake: AlertTriangle,
    rapidAccel: TrendingUp,
    cornering: Minus,
  };

  return (
    <GlassPanel className="p-4">
      <div className="flex flex-col items-center">
        {/* Gauge */}
        <div className="relative" style={{ width: config.width, height: config.width * 0.6 }}>
          <svg viewBox={`0 0 ${config.width} ${config.width * 0.6}`} className="w-full h-full">
            {/* Background arc */}
            <path
              d={calculateArc(100, config.width)}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={config.width * 0.08}
              strokeLinecap="round"
            />
            {/* Score arc */}
            <motion.path
              d={calculateArc(0, config.width)}
              fill="none"
              stroke={category.color.replace('text-', '').replace('-400', '')}
              strokeWidth={config.width * 0.08}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                stroke: `url(#scoreGradient-${score})`,
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score value */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <motion.span
              className={cn('font-bold', config.textSize, 'text-white')}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className={cn(config.labelSize, category.color, 'font-medium')}>
              {category.label}
            </span>
          </div>
        </div>

        {/* Change indicator */}
        {previousScore && (
          <div
            className={cn(
              'flex items-center gap-1 mt-2 text-sm',
              change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-white/50'
            )}
          >
            {change > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : change < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>
              {change > 0 ? '+' : ''}
              {change} from last week
            </span>
          </div>
        )}

        {/* Details */}
        {showDetails && details && (
          <div className="w-full mt-4 grid grid-cols-3 gap-2">
            <div className={cn('p-2 rounded-lg text-center', 'bg-red-500/10')}>
              <AlertTriangle className="w-4 h-4 mx-auto text-red-400 mb-1" />
              <p className="text-xs text-white/50">Hard Brakes</p>
              <p className="text-lg font-semibold text-white">{details.hardBrakeCount}</p>
            </div>
            <div className={cn('p-2 rounded-lg text-center', 'bg-amber-500/10')}>
              <TrendingUp className="w-4 h-4 mx-auto text-amber-400 mb-1" />
              <p className="text-xs text-white/50">Rapid Accel</p>
              <p className="text-lg font-semibold text-white">{details.rapidAccelCount}</p>
            </div>
            <div className={cn('p-2 rounded-lg text-center', 'bg-blue-500/10')}>
              <Minus className="w-4 h-4 mx-auto text-blue-400 mb-1" />
              <p className="text-xs text-white/50">Cornering</p>
              <p className="text-lg font-semibold text-white">{details.corneringEvents}</p>
            </div>
          </div>
        )}

        {/* Fuel Efficiency */}
        {details && (
          <div className="w-full mt-3 p-2 rounded-lg bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60">Fuel Efficiency</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {details.fuelEfficiency} MPG
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}

// Mini score display for dashboard
interface MiniScoreProps {
  score: number;
  label: string;
}

export function MiniScore({ score, label }: MiniScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-400';
    if (s >= 75) return 'text-blue-400';
    if (s >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col items-center p-2">
      <motion.div
        className={cn('text-2xl font-bold', getScoreColor(score))}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {score}
      </motion.div>
      <span className="text-xs text-white/50">{label}</span>
    </div>
  );
}
