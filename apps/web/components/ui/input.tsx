import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

function Input({
  className,
  icon: Icon,
  type,
  ...props
}: React.ComponentProps<"input"> & { icon?: LucideIcon }) {
  return (
    <div className="relative w-full">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "lg:h-10",
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          Icon ? "pl-10" : "pl-3",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
