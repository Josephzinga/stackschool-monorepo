import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const SubmitButton = ({
  isSubmitting,
  children,
  className,
  disabled,
  onClick,
  ...props
}: {
  isSubmitting?: boolean;
  children: React.ReactNode | string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <Button
    {...props}
    onClick={onClick}
    type="submit"
    disabled={isSubmitting || disabled}
    className={cn('font-poppins font-semibold', className)}
  >
    {isSubmitting ? (
      <>
        {' '}
        <Spinner /> {children}
      </>
    ) : (
      children
    )}
  </Button>
);
