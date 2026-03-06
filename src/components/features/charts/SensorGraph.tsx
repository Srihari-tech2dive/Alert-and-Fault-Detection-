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
} from 'recharts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import type { SensorData } from '@/types/alert';

interface SensorGraphProps {
  title: string;
  data: Array<{ timestamp: string; value: number }>;
  currentValue: number;
  unit: string;
  color?: string;
  min?: number;
  max?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  icon?: React.ReactNode;
}

export function SensorGraph({
  title,
  data,
  currentValue,
  unit,
  color = '#3b82f6',
  min = 0,
  max = 100,
  warningThreshold,
  criticalThreshold,
  icon,
}: SensorGraphProps) {
  // Determine status
  const getStatus = () => {
    if (criticalThreshold && currentValue >= criticalThreshold) return 'critical';
    if (warningThreshold && currentValue >= warningThreshold) return 'warning';
    return 'normal';
  };

  const status = getStatus();
  const statusColors = {
    normal: 'text-green-400',
    warning: 'text-amber-400',
    critical: 'text-red-400',
  };

  // Calculate trend
  const trend = React.useMemo(() => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-5);
    const avgRecent = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const older = data.slice(0, -5);
    if (older.length === 0) return 'stable';
    const avgOlder = older.reduce((sum, d) => sum + d.value, 0) / older.length;
    if (avgRecent > avgOlder * 1.05) return 'up';
    if (avgRecent < avgOlder * 0.95) return 'down';
    return 'stable';
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-white/20">
          <p className="text-xs text-white/60">{label}</p>
          <p className="text-sm font-semibold text-white">
            {payload[0].value.toFixed(1)} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassPanel variant="subtle" className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon || <Activity className="w-4 h-4 text-white/60" />}
          <span className="text-sm font-medium text-white/80">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {trend === 'up' && <TrendingUp className="w-3 h-3 text-amber-400" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3 text-blue-400" />}
        </div>
      </div>

      {/* Current Value */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className={cn('text-2xl font-bold', statusColors[status])}>
          {currentValue.toFixed(1)}
        </span>
        <span className="text-sm text-white/50">{unit}</span>
      </div>

      {/* Mini Chart */}
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Threshold indicators */}
      <div className="flex justify-between mt-1 text-xs text-white/40">
        <span>{min}</span>
        {warningThreshold && <span className="text-amber-400">⚠ {warningThreshold}</span>}
        {criticalThreshold && <span className="text-red-400">⛔ {criticalThreshold}</span>}
        <span>{max}</span>
      </div>
    </GlassPanel>
  );
}

// Multiple sensor display grid
interface SensorGridProps {
  sensors: SensorData;
  history: {
    rpm: Array<{ timestamp: string; value: number }>;
    temp: Array<{ timestamp: string; value: number }>;
    speed: Array<{ timestamp: string; value: number }>;
  };
}

export function SensorGrid({ sensors, history }: SensorGridProps) {
  const sensorConfigs = [
    {
      key: 'rpm',
      title: 'RPM',
      data: history.rpm,
      value: sensors.rpm,
      unit: 'RPM',
      color: '#3b82f6',
      min: 0,
      max: 8000,
      warningThreshold: 6000,
      criticalThreshold: 7000,
    },
    {
      key: 'speed',
      title: 'Speed',
      data: history.speed,
      value: sensors.speed,
      unit: 'MPH',
      color: '#22c55e',
      min: 0,
      max: 200,
    },
    {
      key: 'temp',
      title: 'Engine Temp',
      data: history.temp,
      value: sensors.engineTemp,
      unit: '°F',
      color: '#ef4444',
      min: 140,
      max: 260,
      warningThreshold: 230,
      criticalThreshold: 250,
    },
    {
      key: 'fuel',
      title: 'Fuel Level',
      data: [{ timestamp: 'now', value: sensors.fuelLevel }],
      value: sensors.fuelLevel,
      unit: '%',
      color: '#f59e0b',
      min: 0,
      max: 100,
      warningThreshold: 25,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {sensorConfigs.map((config) => (
        <SensorGraph
          key={config.key}
          title={config.title}
          data={config.data}
          currentValue={config.value}
          unit={config.unit}
          color={config.color}
          min={config.min}
          max={config.max}
          warningThreshold={config.warningThreshold}
          criticalThreshold={config.criticalThreshold}
        />
      ))}
    </div>
  );
}
