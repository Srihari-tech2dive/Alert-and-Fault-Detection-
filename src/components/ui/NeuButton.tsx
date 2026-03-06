'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface NeuButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
}

export function NeuButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  rounded = false,
  disabled,
  ...props
}: NeuButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    default: `
      bg-white/10 dark:bg-white/5
      text-white/90 dark:text-white/80
      rounded-lg
      shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.1)]
      dark:shadow-[4px_4px_8px_rgba(0,0,0,0.4),-4px_-4px_8px_rgba(255,255,255,0.05)]
      hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
      active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]
      border border-white/20 dark:border-white/10
    `,
    primary: `
      bg-blue-500/20 dark:bg-blue-500/10
      text-blue-100
      rounded-lg
      shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(59,130,246,0.2)]
      hover:bg-blue-500/30
      active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
      border border-blue-400/30
    `,
    danger: `
      bg-red-500/20 dark:bg-red-500/10
      text-red-100
      rounded-lg
      shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(239,68,68,0.2)]
      hover:bg-red-500/30
      active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
      border border-red-400/30
    `,
    success: `
      bg-green-500/20 dark:bg-green-500/10
      text-green-100
      rounded-lg
      shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(34,197,94,0.2)]
      hover:bg-green-500/30
      active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
      border border-green-400/30
    `,
    ghost: `
      bg-transparent
      text-white/80
      hover:bg-white/10
      active:bg-white/5
      border border-transparent
    `,
  };

  return (
    <motion.button
      className={cn(
        baseStyles,
        sizes[size],
        variants[variant],
        rounded && 'rounded-full',
        className
      )}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </motion.button>
  );
}