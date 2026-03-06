'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  glow?: boolean;
  glowColor?: string;
  animate?: boolean;
  onClick?: () => void;
}

export function GlassPanel({
  children,
  className,
  variant = 'default',
  glow = false,
  glowColor,
  animate = false,
  onClick,
}: GlassPanelProps) {
  const baseStyles = `
    relative overflow-hidden rounded-2xl
    backdrop-blur-xl backdrop-saturate-150
    transition-all duration-300 ease-out
  `;

  const variants = {
    default: `
      bg-white/10 dark:bg-white/5
      border border-white/20 dark:border-white/10
      shadow-lg shadow-black/5 dark:shadow-black/20
    `,
    elevated: `
      bg-white/15 dark:bg-white/8
      border border-white/30 dark:border-white/15
      shadow-xl shadow-black/10 dark:shadow-black/30
    `,
    subtle: `
      bg-white/5 dark:bg-white/3
      border border-white/10 dark:border-white/5
      shadow-sm shadow-black/5
    `,
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        glow && 'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        animate && 'hover:scale-[1.02] hover:shadow-2xl',
        onClick && 'cursor-pointer',
        className
      )}
      style={
        glow
          ? {
              background: glowColor
                ? `linear-gradient(135deg, ${glowColor}10, transparent)`
                : undefined,
            }
          : undefined
      }
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}