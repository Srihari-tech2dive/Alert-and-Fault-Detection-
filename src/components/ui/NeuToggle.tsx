'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const sizeConfig = {
  sm: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
  },
  md: {
    track: 'w-14 h-7',
    thumb: 'w-5 h-5',
    translate: 'translate-x-7',
  },
  lg: {
    track: 'w-18 h-9',
    thumb: 'w-7 h-7',
    translate: 'translate-x-9',
  },
};

const variantStyles = {
  default: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  variant = 'default',
}) => {
  const config = sizeConfig[size];

  const trackStyles = cn(
    'relative rounded-full transition-all duration-300',
    config.track,
    checked
      ? variantStyles[variant]
      : 'bg-gray-300 dark:bg-gray-600',
    'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const thumbStyles = cn(
    'absolute top-1 left-1 rounded-full bg-white',
    config.thumb,
    'shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)]',
    'transition-transform duration-300'
  );

  return (
    <label className={cn(
      'flex items-center gap-3',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
    )}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={trackStyles}
      >
        <motion.div
          className={thumbStyles}
          animate={{
            x: checked ? (size === 'sm' ? 20 : size === 'md' ? 28 : 36) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-foreground">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

// Multi-option Toggle Group
export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={cn(
      'inline-flex p-1 rounded-xl',
      'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
      'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]',
      disabled && 'opacity-50 pointer-events-none'
    )}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'flex items-center gap-2',
              isSelected
                ? 'text-blue-600 dark:text-blue-400 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.05)] bg-white dark:bg-gray-600'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
