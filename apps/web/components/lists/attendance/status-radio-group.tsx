// components/StatusBadgeGroup.tsx
'use client';

import { cn } from '@/lib/utils';
import { Check, Clock, LucideProps, X, type LucideIcon } from 'lucide-react';
import { AttendanceStatusEnum } from '@stackschool/shared';

interface StatusBadgeGroupProps {
  value: AttendanceStatusEnum | null;
  onChange: (status: AttendanceStatusEnum) => void;
  size?: 'sm' | 'md';
}
interface Style {
  label: string;
  icon: LucideIcon;
  activeClass: string;
  inactiveClass: string;
  darkActiveClass: string;
  darkInactiveClass: string;
}
const statusConfig: Record<string, Style> = {
  [AttendanceStatusEnum.PRESENT]: {
    label: 'Présent',
    icon: Check,
    // Light mode
    activeClass:
      'bg-green-500 text-white border-green-500 shadow-sm shadow-green-500/20',
    inactiveClass:
      'bg-transparent text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400',
    // Dark mode
    darkActiveClass:
      'dark:bg-green-600 dark:text-white dark:border-green-500 dark:shadow-green-900/30',
    darkInactiveClass:
      'dark:text-green-400 dark:border-green-700 dark:hover:bg-green-950/50 dark:hover:border-green-600',
  },
  [AttendanceStatusEnum.ABSENT]: {
    label: 'Absent',
    icon: X,
    activeClass:
      'bg-red-500 text-white border-red-500 shadow-sm shadow-red-500/20',
    inactiveClass:
      'bg-transparent text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400',
    darkActiveClass:
      'dark:bg-red-600 dark:text-white dark:border-red-500 dark:shadow-red-900/30',
    darkInactiveClass:
      'dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/50 dark:hover:border-red-600',
  },
  [AttendanceStatusEnum.LATE]: {
    label: 'Retard',
    icon: Clock,
    activeClass:
      'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20',
    inactiveClass:
      'bg-transparent text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400',
    darkActiveClass:
      'dark:bg-amber-600 dark:text-white dark:border-amber-500 dark:shadow-amber-900/30',
    darkInactiveClass:
      'dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-950/50 dark:hover:border-amber-600',
  },
};

export function StatusBadgeGroup({
  value,
  onChange,
  size = 'md',
}: StatusBadgeGroupProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-1 gap-1',
    md: 'px-4 py-1.5 text-xs gap-1.5',
  };

  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
  };

  return (
    <div
      className="inline-flex items-center gap-2"
      role="group"
      aria-label="Statut de présence"
    >
      {(Object.keys(statusConfig) as AttendanceStatusEnum[]).map((status) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isActive = value === status;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            aria-pressed={isActive}
            className={cn(
              'inline-flex items-center justify-center rounded-full border font-medium transition-all duration-200 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
              'disabled:opacity-50 disabled:pointer-events-none',
              sizeClasses[size],
              isActive
                ? cn(config.activeClass, config.darkActiveClass, 'scale-105')
                : cn(
                    config.inactiveClass,
                    config.darkInactiveClass,
                    'active:scale-95',
                  ),
            )}
          >
            <Icon
              className={cn(
                iconSizes[size],
                isActive ? 'stroke-[2.5px]' : 'stroke-2',
              )}
            />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
