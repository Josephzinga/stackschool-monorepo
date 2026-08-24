import {Button} from '../ui/button';
import {cn} from '@/lib/utils';
import React from "react";

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
      className={cn('font-poppins font-medium', className)}
    >
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`}
        className="flex gap-3 justify-center items-center"
      >
        {icon}

        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </a>
    </Button>
  );
};
