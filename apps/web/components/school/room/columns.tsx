import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
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

export type RoomColumns = {
  id: string;
  name: string | null;
  capacity?: number | null;
  type?: string | null;
  code?: string | null;
  defaultForClass: {
    id: string;
    name: string;
  };
  class?: {
    id: string;
    name: string;
  };
} | null;

export const columns: ColumnDef<RoomColumns>[] = [
  {
    accessorKey: 'name',
    header: 'Salle',
    cell: ({ row }) => {
      return (
        <div className="pl-2">
          <span key={row.original?.id}>{row.original?.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Place',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      if (!row.original?.type)
        return (
          <span className="font-inter italic opacity-80">Non définie.</span>
        );
      return (
        <div>
          <Badge variant="outline">{row.original?.type}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'class',
    header: 'Classe occupé',
    cell: ({ row }) => {
      const classe = row.original?.defaultForClass;

      if (!classe?.id)
        return (
          <span className="font-inter italic opacity-80">Non assigné</span>
        );
      return (
        <div>
          <Badge variant="secondary">{classe.name}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      return (
        <div className="flex justify-center items-center">
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
    },
  },
];
