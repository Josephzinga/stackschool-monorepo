'use client';

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
import { Row, TableMeta } from '@tanstack/react-table';
import { ClassData } from '@/components/lists/class/table/columns';
import { ClassFeatures } from '@/components/lists/class/table/data-table';

export default function ClassAction({
  row,
  meta,
}: {
  row: Row<ClassFeatures, ClassData>;
  meta?: TableMeta<ClassFeatures, ClassData>;
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.openEdit?.(row.original)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.openAdd?.(row.original)}>
              Ajouter un enseignant
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
