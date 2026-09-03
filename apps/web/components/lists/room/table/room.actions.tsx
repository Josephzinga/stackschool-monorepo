import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { RoomFeatures } from '@/components/lists/room/table/data-table';
import { RoomData } from '@/components/lists/room/table/columns';
import { AppTableMeta } from '@/types/tanstack-table';

export default function RoomAction({
  row,
  meta,
}: {
  row: Row<RoomFeatures, RoomData>;
  meta?: AppTableMeta<RoomData>;
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">Ouvrez le menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir détails</DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.openEdit?.(row.original)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => meta?.openDelete?.(row.original)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
