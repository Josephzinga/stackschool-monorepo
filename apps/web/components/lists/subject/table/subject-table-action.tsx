import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import * as React from 'react';
import { useState } from 'react';
import { Row, TableMeta } from '@tanstack/react-table';
import { SubjectColumns } from '@/components/lists/subject/table/columns';
import { useDeleteSubjectsMutation } from '@stackschool/ui';
import { toast } from 'sonner';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { SubjectFeatures, SubjectTableMeta } from './data-table';
import { AppTableMeta } from '@/types/tanstack-table';

export function SubjectTableAction({
  row,
  meta,
}: {
  row: Row<SubjectFeatures, SubjectColumns>;
  meta?: SubjectTableMeta;
}) {
  return (
    <div className="w-full flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Ouvrez le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => meta?.openEdit?.(row.original)}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Copy')}>
            Copier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => meta?.openDelete?.(row.original)}
            variant="destructive"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
