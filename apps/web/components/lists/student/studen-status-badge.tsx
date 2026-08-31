import { studentStatusConfig } from '@stackschool/ui';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const studentStatusStyles = {
  ACTIVE: 'bg-green-700/20 text-green-500',
  SUSPENDED: 'bg-orange-100 text-orange-700',
  EXPELLED: 'bg-red-100 text-red-700',
  TRANSFERRED: 'bg-blue-100 text-blue-700',
  DROPPED_OUT: 'bg-purple-100 text-purple-700',
  GRADUATED: 'bg-emerald-100 text-emerald-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
  DECEASED: 'bg-zinc-200 text-zinc-700',
};
export function StudentStatusBadge({
  status,
}: {
  status: keyof typeof studentStatusConfig;
}) {
  const config = studentStatusConfig[status];
  return (
    <Badge
      className={cn(
        'px-2 py-0.5 text-xs font-medium',
        studentStatusStyles[status],
      )}
    >
      {config.label}
    </Badge>
  );
}
