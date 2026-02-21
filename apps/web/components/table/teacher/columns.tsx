'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Classe } from '@stackschool/ui';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TeacherActions } from '@/components/table/teacher/teacher-actions';
import { useTable } from '@/components/table/teacher/table-provider';

export type Teacher = {
  id: string | number;
  firstname: string;
  lastname: string;
  email?: string;
  photo?: string;
  phoneNumber?: string;
  speciality: string | string[];
  status: boolean;
  classes: Pick<Classe, 'id' | 'name'>[];
};

export const columns: ColumnDef<Teacher>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      );
    },
    cell: ({ row, table }) => {
      const { setSelectedIds, selectedIds } = useTable();

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setSelectedIds(
              table.getSelectedRowModel().rows.map((row) => row.original.id),
            );
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'profile',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting();
            console.log('sorting', column.getIsSorted());
          }}
        >
          Profile
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table, cell }) => {
      const photo = row.original.photo;

      return (
        <div className="w-full h-full flex gap-2 items-center ">
          <Avatar className="h-12 w-12">
            <AvatarImage src={photo} />
            <AvatarFallback>
              {row.original.firstname[0] + row.original.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{row.original.lastname}</p>
            <p>{row.original.firstname}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'speciality',
    header: 'Spécialité',
  },

  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Téléphone',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="w-32">
          <Badge
            variant="outline"
            className={cn(
              'font-semibold px-2 ',
              row.original.status ? 'bg-chart-4/60' : 'bg-chart-2',
            )}
          >
            {row.original.status ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'classes',
    header: 'Classes',
    cell: ({ row }) => {
      const count = row.original.classes.length;
      return <div>{count ? count : <Badge>Non assigné</Badge>}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <TeacherActions row={row} />,
  },
];
