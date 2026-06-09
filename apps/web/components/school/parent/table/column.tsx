import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { useState } from 'react';
import { RelationTypeEnum } from '@stackschool/shared';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ParentActions } from '@/components/school/parent/table/parent-actions';

export type ParentColumn = {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string | null;
  photo?: string;
  email?: string | null;
  address?: string;
  profession: string;
  contactPreference?: string;
  students: {
    id: string;
    firstname: string;
    lastname: string;
    relationType: RelationTypeEnum;
    classe: {
      name: string;
      level: string;
    };
  }[];
};
export const columns: ColumnDef<ParentColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        className="cursor-pointer"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="cursor-pointer"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'info',
    header: 'Parents',
    cell: ({ row }) => {
      return (
        <Link
          href={`/list/parents/${row.original.id}`}
          className="block w-full h-full"
        >
          <div className="flex gap-3 items-center hover:bg-accent p-1 rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.original?.photo} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstname?.[0]}
                {row.original.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstname} {row.original.lastname}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Numéro de tel',
    cell: ({ row }) => {
      return <span>{row.original.phoneNumber ?? 'Non assigné'}</span>;
    },
  },
  {
    accessorKey: 'profession',
    header: 'Proféssion',
    cell: ({ row }) => {
      return <span>{row.original.profession}</span>;
    },
  },
  {
    accessorKey: 'address',
    header: 'Adresse',
    cell: ({ row }) => {
      return <span>{row.original.address || '-'}</span>;
    },
  },
  {
    accessorKey: 'students',
    header: 'Enfant (s)',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const student = row.original.students;
      const firstStudent = student[0];
      const remainingCount = student.length - 1;
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(true)}
              className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition"
            >
              {firstStudent?.firstname} {firstStudent?.lastname}
              {remainingCount > 0 && (
                <span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 px-2"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <div className="grid grid-cols-2 text-xs">
              {student?.map((s) => (
                <div key={s.id} className="px-2 py-1 rounded-md hover:bg-muted">
                  {s.firstname} {s.lastname}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <ParentActions row={row} meta={table.options.meta} />
    ),
  },
];
