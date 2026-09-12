'use client';

import { Row } from '@tanstack/react-table';
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
import { IconDotsVertical } from '@tabler/icons-react';
import { ParentData } from '@/components/lists/parent/table/column';
import {
  ParentFeatures,
  ParentTableMeta,
} from '@/components/lists/parent/table/data-table';

export function ParentActions({
  row,
  meta,
}: {
  row: Row<ParentFeatures, ParentData>;
  meta?: ParentTableMeta;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted cursor-pointer text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta?.openEdit?.(row.original)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => meta?.onAssignStudent?.(row.original)}
            >
              Assigné des élèves
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Copy', row.original.id)}
            >
              Copier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => meta?.openDelete?.(row.original)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
