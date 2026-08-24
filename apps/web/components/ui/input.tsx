import * as React from 'react';
import {useState} from 'react';
import {cn} from '@/lib/utils';
import {Eye, EyeOff, LucideIcon} from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className,isPassword, icon: Icon, rightElement, type, ...props }, ref) => {

        const [showPassword, setShowPassword] = useState(false)


      return (
          <div className="relative">
            {Icon && (
                <span className="absolute font-poppins left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-5 w-5" />
          </span>
            )}
            <input
                type={isPassword ? (showPassword ? 'password' : 'text') : type}
                className={cn(
                    'flex font-sans w-full rounded-4xl border border-input bg-input px-3 py-2 text-sm' ,
                    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base" ,

                    " transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent" ,
                    " file:text-sm file:font-medium placeholder:text-muted-foreground" ,
                    " focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed" ,
                    " disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3" ,
                    " aria-invalid:ring-destructive/20 md:text-sm ","dark:bg-input/30 dark:disabled:bg-input/80" +
                    " dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                    Icon && 'pl-10',
                    rightElement && 'pr-10',
                    className
                )}
                ref={ref}
                {...props}
            />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPassword &&   <EyesInput showPassword={showPassword} setShowPassword={setShowPassword} />}
                </div>

          </div>
      );
    }
);
Input.displayName = 'Input';


const EyesInput = ({showPassword, setShowPassword}: {showPassword: boolean, setShowPassword: (value: boolean) => void}) => {
    return (
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}

                aria-label={
                    showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'
                }
            >
                {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                ) : (
                    <Eye className="w-4 h-4" />
                )}
            </button>
    )
}
