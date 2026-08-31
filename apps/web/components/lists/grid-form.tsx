import { cn } from '@/lib/utils';

export const GridForm = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn('grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3', className)}
  >
    {children}
  </div>
);
