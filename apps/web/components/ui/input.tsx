import * as React from 'react';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

function Input({
  className,
  icon: Icon,
  isPassword,
  type,
  ...props
}: React.ComponentProps<'input'> & {
  icon?: LucideIcon;
  isPassword?: boolean;
}) {
  const [showPwd, setShowPwd] = React.useState(true);
  return (
    <div className="relative w-full">
      {Icon && (
        <span className="absolute  left-3 top-1/2 -translate-y-1/2 ">
          <Icon className="h-5 w-5 text-gray-400" />
        </span>
      )}
      <input
        type={isPassword ? (showPwd ? 'password' : 'text') : type}
        data-slot="input"
        placeholder={isPassword ? '********' : undefined}
        className={cn(
          'lg:h-10',
          'file:text-foreground border border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-10 w-full min-w-0 rounded-lg bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          Icon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          aria-label={
            showPwd ? 'Cacher le mot de passe' : 'Afficher le mot de passe'
          }
        >
          {showPwd ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
