'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import type { ChartDataPoint, DegradationTrend } from '@/types/alert';
import { cn } from '@/lib/utils';

// Custom tooltip component defined outside render
const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-white/20">
        <p className="text-xs text-white/60">{label}</p>
        <p className="text-sm font-semibold text-white">
          {payload[0].value}{unit}
        </p>
      </div>
    );
  }
  return null;
};

// Multi-tooltip for comparison chart
const MultiTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-white/20">
        <p className="text-xs text-white/60 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface DegradationChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  trend?: DegradationTrend;
  color?: string;
  unit?: string;
  showPrediction?: boolean;
  predictedValue?: number;
  threshold?: number;
}

export function DegradationChart({
  data,
  title,
  subtitle,
  trend = 'STABLE',
  color = '#3b82f6',
  unit = '%',
  showPrediction = false,
  predictedValue,
  threshold,
}: DegradationChartProps) {
  const trendConfig = {
    STABLE: { icon: TrendingUp, color: 'text-green-400', label: 'Stable' },
    DECLINING: { icon: TrendingDown, color: 'text-amber-400', label: 'Declining' },
    CRITICAL: { icon: AlertTriangle, color: 'text-red-400', label: 'Critical' },
  };

  const TrendIcon = trendConfig[trend].icon;

  // Calculate current and change values
  const currentValue = data[data.length - 1]?.value ?? 0;
  const previousValue = data[data.length - 2]?.value ?? currentValue;
  const change = currentValue - previousValue;

  return (
    <GlassPanel className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white/90">{title}</h3>
          {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('flex items-center gap-1', trendConfig[trend].color)}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-xs font-medium">{trendConfig[trend].label}</span>
        </div>
      </div>

      {/* Current Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{currentValue}</span>
          <span className="text-white/60">{unit}</span>
          {change !== 0 && (
            <span
              className={cn(
                'text-sm',
                change < 0 ? 'text-red-400' : 'text-green-400'
              )}
            >
              {change > 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="timestamp"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title.replace(/\s/g, '')})`}
            />
            {threshold !== undefined && (
              <Line
                type="monotone"
                dataKey={() => threshold}
                stroke="rgba(239, 68, 68, 0.5)"
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Prediction */}
      {showPrediction && predictedValue !== undefined && (
        <div className="mt-4 p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Predicted (30 days)</span>
            <span
              className={cn(
                'text-sm font-semibold',
                predictedValue < 50 ? 'text-red-400' : 'text-white/80'
              )}
            >
              {predictedValue}{unit}
            </span>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}

// Multi-line comparison chart
interface ComparisonChartProps {
  datasets: Array<{
    name: string;
    data: ChartDataPoint[];
    color: string;
  }>;
  title: string;
}

export function ComparisonChart({ datasets, title }: ComparisonChartProps) {
  // Merge datasets by timestamp
  const mergedData = React.useMemo(() => {
    const timestampMap = new Map<string, Record<string, number | string>>();
    datasets.forEach((dataset) => {
      dataset.data.forEach((point) => {
        const existing = timestampMap.get(point.timestamp) || {};
        timestampMap.set(point.timestamp, {
          ...existing,
          timestamp: point.timestamp,
          [dataset.name]: point.value,
        });
      });
    });
    return Array.from(timestampMap.values());
  }, [datasets]);

  return (
    <GlassPanel className="p-4">
      <h3 className="font-semibold text-white/90 mb-4">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="timestamp"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
            />
            <Tooltip content={<MultiTooltip />} />
            {datasets.map((dataset) => (
              <Line
                key={dataset.name}
                type="monotone"
                dataKey={dataset.name}
                stroke={dataset.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-3 justify-center">
        {datasets.map((dataset) => (
          <div key={dataset.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dataset.color }}
            />
            <span className="text-xs text-white/60">{dataset.name}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}