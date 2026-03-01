import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InfoItem({
  children,
  icon: Icon,
  className,
  iconClassName,
  notFoundText,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  notFoundText?: string;
}) {
  if (!children && !notFoundText) return null;
  return (
    <div className="flex items-center gap-1 xl:gap-3">
      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
        <Icon className={cn('h-4 w-4 text-slate-600', iconClassName)} />
      </div>
      <p
        className={cn(
          'text-sm text-wrap font-medium text-slate-700 dark:text-slate-200',
          !children && 'text-xs text-slate-400 dark:text-slate-600',
          className,
        )}
      >
        {children || notFoundText}
      </p>
    </div>
  );
}
