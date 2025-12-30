import { cn } from '@/lib/utils';

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex w-full min-h-screen items-center justify-center bg-slate-100 dark:bg-gray-900 ',
        className,
      )}
    >
      {children}
    </div>
  );
};
