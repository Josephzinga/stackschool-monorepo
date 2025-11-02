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
        "flex w-full min-h-screen items-center justify-center bg-linear-to-br from-slate-100 to-slate-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",
        className
      )}>
      {children}
    </div>
  );
};
