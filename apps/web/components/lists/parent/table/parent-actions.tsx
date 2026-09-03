'use client';

import { Row } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import { ParentData } from '@/components/lists/parent/table/column';
import { ParentFeatures } from '@/components/lists/parent/table/data-table';
import { AppTableMeta } from '@/types/tanstack-table';

export function ParentActions({
  row,
  meta,
}: {
  row: Row<ParentFeatures, ParentData>;
  meta?: AppTableMeta<ParentData>;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => console.log('Edit', row.original.id)}
          >
            Editer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log('Copy', row.original.id)}
          >
            Copier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => setShowDeleteAlert(true)}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
