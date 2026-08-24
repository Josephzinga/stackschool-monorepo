import {Card, CardAction, CardTitle} from '@/components/ui/card';
import {IconTrendingUp} from '@tabler/icons-react';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {LucideIcon} from 'lucide-react';

interface UserCardProps {
  title: number | string;
  className?: string;
  description: string;
  badgeTitle: string;
  badgeClassName?: string;
  info: string;
  DescriptionIcon?: LucideIcon;
  badgeIcon?: LucideIcon;
}
export default function UserCard({
  title,
  description,
  badgeTitle,
  badgeClassName,
  className,
  info,
  DescriptionIcon,
  badgeIcon: BadgeIcon,
}: UserCardProps) {
  return (
    <Card
      className={cn(
        'shadow-[2px_4px_2px_0_rgba(0,0,0,0.1)]! bg-linear-to-t! gap-2! md:px-1 min-w-45 w-full flex-1 flex' ,
          ' even:bg-linear-to-tr! even:from-card even:to-secondary odd:bg-linear-to-tl odd:from-card odd:to-secondary py-2' +
          ' px-1!' ,
          ' font-poppins',
        className,
      )}
    >
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center px-1">
          <CardTitle className="flex font-medium font-poppins items-center gap-1">
            {DescriptionIcon && <DescriptionIcon className="h-4 w-4" />}
            {description}
          </CardTitle>
          <CardAction className="flex flex-wrap">
            <Badge
              variant="outline"
              className={cn(
                'border-primary flex items-center h-4!',
                badgeClassName,
              )}
            >
              {BadgeIcon ? (
                <BadgeIcon className="h-3 w-3" />
              ) : (
                <IconTrendingUp className="h-3 w-3" />
              )}
              <span className="text-xs font-poppins">{badgeTitle}</span>
            </Badge>
          </CardAction>
        </div>

        <div className="py-1">
          <p className="text-2xl text-center font-semibold">{title}</p>
        </div>
      </div>

      <div className="flex-col justify-center items-end gap-1.5 text-sm">
        <p className="text-muted-foreground text-center ">{info}</p>
      </div>
    </Card>
  );
}
