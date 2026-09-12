import { Row } from '@tanstack/react-table';
import { StudentsData } from '@/components/lists/student/table/columns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import * as React from 'react';
import { StudentFeatures } from '@/components/lists/student/table/data-table';
import { AppTableMeta } from '@/types/tanstack-table';

export function StudentTableActions({
  row,
  meta,
}: {
  row: Row<StudentFeatures, StudentsData>;
  meta?: AppTableMeta<StudentsData>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
