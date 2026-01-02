import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export const SubmitButton = ({
  isSubmitting,
  children,
  className,
}: {
  isSubmitting: boolean;
  children: React.ReactNode | string;
  className?: string;
}) => (
  <Button type="submit" disabled={isSubmitting} className={className}>
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
