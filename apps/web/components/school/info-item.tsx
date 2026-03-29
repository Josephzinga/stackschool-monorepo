import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InfoItem({
  children,
  icon: Icon,
  className,
  iconClassName,
  notFoundText = 'Non assignée',
  label,
  value,
}: {
  children?: React.ReactNode;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  notFoundText?: string;
  label?: string;
  value?: string | null;
}) {
  if (!children && !notFoundText) return null;
  return (
    <div className="flex items-center gap-1 xl:gap-3">
      <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full">
        <Icon className={cn('h-4 w-4 text-slate-600', iconClassName)} />
      </div>
      <div
        className={cn(
          'text-sm text-wrap font-medium text-slate-700 dark:text-slate-200',

          className,
        )}
      >
        <p className="text-xs text-muted-foreground opacity-80 uppercase tracking-wider">
          {label}
        </p>
        {children ? (
          children
        ) : (
          <>
            <p className="font-medium text-sm">
              {value || (
                <span className="font-mono opacity-70 text-xs">
                  {notFoundText}
                </span>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
