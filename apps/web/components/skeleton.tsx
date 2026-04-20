import { cn } from '@/lib/utils';

export default function DataTableSkeleton({
  isLoading,
}: {
  isLoading?: boolean;
}) {
  return (
    <div className="absolute inset-0 h-full bg-white/50 dark:bg-slate-800/70 z-50 flex flex-col backdrop-blur-sm">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center flex-row animate-pulse px-4 w-full h-14 even:bg-slate-50 dark:even:bg-slate-950"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3.5 bg-slate-400 dark:bg-slate-700 rounded-sm',
                i % 2 === 0 ? 'w-25' : 'w-20',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
