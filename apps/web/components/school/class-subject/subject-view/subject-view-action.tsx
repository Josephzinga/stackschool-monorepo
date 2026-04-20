'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row, TableMeta } from '@tanstack/react-table';
import { SubjectColumns } from './columns';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

export function SubjectViewAction({
  row,
  meta,
}: {
  row: Row<SubjectColumns>;
  meta?: TableMeta<SubjectColumns>;
}) {
  const handleEdit = () => {
    meta?.openEdit({
      id: row.original?.id!,
      subjectId: row.original?.subject?.id ?? '',
      teacherId: row.original?.teacher?.id ?? '',
      coefficient: row.original?.coefficient || 0,
      weeklyHours: row.original?.weeklyHours || 0,
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <MoreVertical />
            <span className="sr-only">Ouvrez le menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={handleEdit}>Modifier</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => meta?.openDelete(row.original)}
            variant="destructive"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
