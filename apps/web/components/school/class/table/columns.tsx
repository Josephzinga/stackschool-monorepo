'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import ClassAction from '@/components/school/class/table/class-action';

export type ClassData = {
  id: string;
  name: string;
  level: string;
  section?: string | null;
  supervisor?: {
    id?: string;
    email: string | null;
    username: string | null;
    phoneNumber: string | null;
    profile: {
      firstname?: string | null;
      lastname?: string | null;
      photo?: string | null;
    };
  } | null;
  _count: {
    students: number;
    teachers?: number | null;
    subjects?: number | null;
  } | null;
};

export const columns: ColumnDef<ClassData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Classe
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link
        href={`/list/classes/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'level',
    header: 'Niveau',
    cell: ({ row }) => <Badge variant="outline">{row.getValue('level')}</Badge>,
  },
  {
    accessorKey: 'section',
    header: 'Section',
    cell: ({ row }) => row.getValue('section') || '-',
  },
  {
    accessorKey: 'supervisor',
    header: 'Prof. Principal',
    cell: ({ row }) => {
      const supervisor = row.original.supervisor;
      if (!supervisor?.id)
        return (
          <span className="text-muted-foreground text-xs">Non assigné</span>
        );

      const profile = supervisor.profile;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.photo || undefined} />
            <AvatarFallback className="text-[10px]">
              {profile?.firstname?.[0]}
              {profile?.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">
            {profile?.firstname} {profile?.lastname}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'students',
    header: () => (
      <div className="flex items-center gap-1">
        <span>Élèves</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center ">
        <span className="font-medium font-inter text-xs sm:text-sm text-center">
          {row.original?._count?.students}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'subjects',
    header: 'Matières',
    cell: ({ row }) => {
      const subjects = row.original?._count?.subjects;
      return (
        <div className="flex justify-center items-center ">
          <span className="font-medium font-inter text-xs sm:text-sm text-center">
            {subjects}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'teachers',
    header: 'Professeurs',
    cell: ({ row }) => {
      const teachers = row.original?._count?.teachers;
      return (
        <div className="flex justify-center items-center ">
          <span className="font-medium font-inter text-xs sm:text-sm text-center">
            {teachers}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ClassAction row={row} />,
  },
];
