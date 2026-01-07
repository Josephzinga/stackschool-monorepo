import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const SubmitButton = ({
  isSubmitting,
  children,
  className,
  ...props
}: {
  isSubmitting: boolean;
  children: React.ReactNode | string;
  className?: string;
}) => (
  <Button
    {...props}
    type="submit"
    disabled={isSubmitting}
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
