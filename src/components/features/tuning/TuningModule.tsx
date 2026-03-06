'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  AlertTriangle,
  CheckCircle,
  Undo2,
  Shield,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeuButton } from '@/components/ui/NeuButton';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { TuningParameter } from '@/types/alert';

interface TuningSliderProps {
  parameter: TuningParameter;
  onValueChange: (id: string, value: number) => void;
  disabled?: boolean;
}

export function TuningSlider({ parameter, onValueChange, disabled }: TuningSliderProps) {
  const [localValue, setLocalValue] = useState(parameter.currentValue);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const riskColors = {
    LOW: 'text-green-400 bg-green-500/20',
    MEDIUM: 'text-amber-400 bg-amber-500/20',
    HIGH: 'text-red-400 bg-red-500/20',
  };

  const handleValueChange = (values: number[]) => {
    setLocalValue(values[0]);
  };

  const handleConfirm = () => {
    onValueChange(parameter.id, localValue);
    setShowConfirmModal(false);
  };

  return (
    <>
      <GlassPanel variant="subtle" className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-white/90">{parameter.name}</h4>
            <p className="text-xs text-white/50 mt-1">{parameter.description}</p>
          </div>
          <span className={cn('text-xs px-2 py-1 rounded-full', riskColors[parameter.riskLevel])}>
            {parameter.riskLevel} RISK
          </span>
        </div>

        {/* Current Value Display */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-white">
            {localValue.toFixed(parameter.unit === ':1' ? 1 : 0)}
          </span>
          <span className="text-white/50">{parameter.unit}</span>
        </div>

        {/* Slider */}
        <div className="mb-3">
          <Slider
            value={[localValue]}
            min={parameter.minValue}
            max={parameter.maxValue}
            step={parameter.unit === ':1' ? 0.1 : 1}
            onValueChange={handleValueChange}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between mt-1 text-xs text-white/40">
            <span>{parameter.minValue}</span>
            <span>{parameter.maxValue}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <NeuButton
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => setShowConfirmModal(true)}
            disabled={disabled || localValue === parameter.currentValue}
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Apply Change
          </NeuButton>
          {parameter.isReversible && (
            <NeuButton variant="ghost" size="sm" disabled={disabled} icon={<Undo2 className="w-4 h-4" />}>
              Reset
            </NeuButton>
          )}
        </div>
      </GlassPanel>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <TuningConfirmModal
            parameter={parameter}
            newValue={localValue}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Safety confirmation modal
interface TuningConfirmModalProps {
  parameter: TuningParameter;
  newValue: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function TuningConfirmModal({
  parameter,
  newValue,
  onConfirm,
  onCancel,
}: TuningConfirmModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledged, setAcknowledged] = useState({
    risk: false,
    irreversible: false,
    safety: false,
  });

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        onConfirm();
        setIsLoading(false);
      }, 1500);
    }
  };

  const allAcknowledged = Object.values(acknowledged).every((v) => v);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
      >
        <GlassPanel variant="elevated" className="overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-red-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/20">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">ECU Parameter Change</h3>
                <p className="text-xs text-white/60">Safety Confirmation Required</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className={cn('flex items-center', s < 3 && 'flex-1')}>
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      s <= step ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40'
                    )}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2',
                        s < step ? 'bg-red-500' : 'bg-white/10'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>Review</span>
              <span>Acknowledge</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-white/70">You are about to modify:</p>
                    <p className="text-lg font-semibold text-white mt-1">{parameter.name}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="text-center">
                      <p className="text-xs text-white/50">Current</p>
                      <p className="text-xl font-bold text-white">{parameter.currentValue}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/30" />
                    <div className="text-center">
                      <p className="text-xs text-white/50">New</p>
                      <p className="text-xl font-bold text-blue-400">{newValue}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-100">Risk Level: {parameter.riskLevel}</p>
                        <p className="text-xs text-amber-200/70 mt-1">
                          {parameter.riskLevel === 'HIGH'
                            ? 'This change may affect vehicle safety and emissions compliance.'
                            : parameter.riskLevel === 'MEDIUM'
                            ? 'This change may affect vehicle performance.'
                            : 'This is a low-risk parameter adjustment.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-white/70">Please acknowledge the following:</p>
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledged.risk}
                      onChange={(e) => setAcknowledged({ ...acknowledged, risk: e.target.checked })}
                      className="mt-1"
                    />
                    <span className="text-sm text-white/80">
                      I understand the risks associated with this modification
                    </span>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledged.irreversible}
                      onChange={(e) =>
                        setAcknowledged({ ...acknowledged, irreversible: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <span className="text-sm text-white/80">
                      {!parameter.isReversible
                        ? 'I understand this change is IRREVERSIBLE'
                        : 'I understand this change can be reverted later'}
                    </span>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledged.safety}
                      onChange={(e) =>
                        setAcknowledged({ ...acknowledged, safety: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <span className="text-sm text-white/80">
                      I confirm the vehicle is parked and engine is off
                    </span>
                  </label>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-center"
                >
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-white">Final Confirmation</p>
                    <p className="text-sm text-white/70 mt-2">
                      Are you sure you want to write this change to the ECU?
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center justify-center gap-4">
                      <div>
                        <p className="text-xs text-white/50">Parameter</p>
                        <p className="text-sm font-medium text-white">{parameter.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">New Value</p>
                        <p className="text-sm font-medium text-blue-400">
                          {newValue} {parameter.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-white/10 flex gap-2">
            <NeuButton variant="ghost" onClick={onCancel} className="flex-1">
              Cancel
            </NeuButton>
            <NeuButton
              variant="danger"
              onClick={handleNextStep}
              disabled={(step === 2 && !allAcknowledged) || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === 3 ? (
                'Write to ECU'
              ) : (
                'Continue'
              )}
            </NeuButton>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

// Tuning history panel
interface TuningHistoryProps {
  history: Array<{
    id: string;
    parameterName: string;
    oldValue: number;
    newValue: number;
    timestamp: string;
    reversed: boolean;
  }>;
  onReverse: (id: string) => void;
}

export function TuningHistory({ history, onReverse }: TuningHistoryProps) {
  if (history.length === 0) {
    return (
      <GlassPanel variant="subtle" className="p-4 text-center">
        <Clock className="w-8 h-8 mx-auto text-white/30 mb-2" />
        <p className="text-sm text-white/50">No tuning history yet</p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel variant="subtle" className="p-4">
      <h4 className="font-medium text-white/90 mb-3">Recent Changes</h4>
      <div className="space-y-2">
        {history.slice(0, 5).map((entry) => (
          <div
            key={entry.id}
            className={cn(
              'flex items-center justify-between p-2 rounded-lg',
              'bg-white/5',
              entry.reversed && 'opacity-50'
            )}
          >
            <div>
              <p className="text-sm text-white/80">{entry.parameterName}</p>
              <p className="text-xs text-white/50">
                {entry.oldValue} → {entry.newValue}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              {!entry.reversed && (
                <NeuButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onReverse(entry.id)}
                  icon={<Undo2 className="w-3 h-3" />}
                >
                  <span className="sr-only">Reverse</span>
                </NeuButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}