import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export const ButtonSocial = ({
  provider,
  icon,
  className,
}: {
  provider: string;
  icon: React.JSX.Element;
  className?: string;
}) => {
  return (
    <Button
      variant="outline"
      type="button"
      className={cn('w-full h-10 font-inter font-semibold', className)}
    >
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`}
        className="flex gap-3 w-full h-full justify-center items-center"
      >
        {icon}
        Connectez vous avec{' '}
        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </a>
    </Button>
  );
};
