import { cn } from "@/lib/utils";

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
        "flex h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900",
        className
      )}>
      {children}
    </div>
  );
};
