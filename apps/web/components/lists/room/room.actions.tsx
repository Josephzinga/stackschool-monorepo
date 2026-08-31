import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Row, TableMeta } from '@tanstack/react-table';
import { RoomColumns } from '@/components/lists/room/columns';

export default function RoomActions({
  row,
  meta,
}: {
  row: Row<RoomColumns>;
  meta: TableMeta<RoomColumns>;
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
            <span className="sr-only">Ouvrez le menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Voir détails</DropdownMenuItem>
          <DropdownMenuItem onClick={() => meta?.openEdit(row.original)}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => meta?.openDelete(row.original)}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
