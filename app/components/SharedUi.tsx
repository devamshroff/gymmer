'use client';

import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  paddingClassName?: string;
  borderClassName?: string;
  borderWidthClassName?: string;
};

export function Card({
  children,
  className = '',
  paddingClassName,
  borderClassName = 'border-zinc-700',
  borderWidthClassName = 'border-2'
}: CardProps) {
  const padding = paddingClassName || 'p-4';
  return (
    <div className={`bg-zinc-800 rounded-lg ${borderWidthClassName} ${borderClassName} ${padding} ${className}`.trim()}>
      {children}
    </div>
  );
}

type EmptyStateProps = {
  message: string;
  description?: string;
  className?: string;
};

export function EmptyState({ message, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg ${className}`.trim()}>
      <div>{message}</div>
      {description && <div className="text-zinc-600 text-sm mt-1">{description}</div>}
    </div>
  );
}

type BottomActionBarProps = {
  children: ReactNode;
  maxWidthClassName?: string;
  className?: string;
};

export function BottomActionBar({
  children,
  maxWidthClassName = 'max-w-2xl',
  className = ''
}: BottomActionBarProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 ${className}`.trim()}>
      <div className={`${maxWidthClassName} mx-auto`}>
        {children}
      </div>
    </div>
  );
}

type SectionHeaderProps = {
  icon: string;
  label: string;
  iconClassName?: string;
  className?: string;
};

export function SectionHeader({
  icon,
  label,
  iconClassName = 'text-zinc-400',
  className = ''
}: SectionHeaderProps) {
  return (
    <h2 className={`text-xl font-bold text-white mb-4 flex items-center gap-2 ${className}`.trim()}>
      <span className={iconClassName}>{icon}</span>
      {label}
    </h2>
  );
}
