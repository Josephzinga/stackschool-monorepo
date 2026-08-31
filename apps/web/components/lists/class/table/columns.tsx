'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import ClassAction from '@/components/lists/class/table/class-action';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import * as React from 'react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ClassFeatures } from '@/components/lists/class/table/data-table';

export type ClassData = {
  id: string;
  name: string;
  level: string;
  section?: string | null;
  teachers?: Array<{
    id: string;
    lastname?: string | null;
    firstname?: string | null;
  } | null> | null;
  subjects?:
    | Array<{
        id: string | null;
        name: string | null;
        code?: string | null;
      } | null>
    | null
    | undefined;
  supervisor?: {
    id?: string;
    profile: {
      firstname?: string | null;
      lastname?: string | null;
      photo?: string | null;
    };
  } | null;
  count: {
    students: number;
    teachers?: number | null;
    subjects?: number | null;
  } | null;
};
const columnHelper = createColumnHelper<ClassFeatures, ClassData>();
export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('name', {
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
  }),
  columnHelper.accessor('level', {
    header: 'Niveau',
    cell: ({ row }) => <Badge variant="outline">{row.getValue('level')}</Badge>,
  }),
  columnHelper.accessor('section', {
    header: 'Section',
    cell: ({ row }) => row.getValue('section') || '-',
  }),
  columnHelper.accessor('count.students', {
    header: () => (
      <div className="flex items-center gap-1">
        <span>Élèves</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center ">
        <span className="font-medium font-inter text-xs sm:text-sm text-center">
          {row.original?.count?.students}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('supervisor', {
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
  }),
  columnHelper.accessor('subjects', {
    header: 'Matières',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const subjects = row.original.subjects;
      const firstSubject = subjects?.[0];
      const remainingCount = (subjects?.length || 1) - 1;

      if (subjects && subjects.length === 0) {
        return (
          <span className="text-xs text-muted-foreground italic">
            Aucune matière assigné
          </span>
        );
      }
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            disabled={!remainingCount}
            asChild
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(true)}
              className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition"
            >
              {firstSubject?.name} <span>{firstSubject?.code}</span>
              {remainingCount > 0 && (
                <span className="text-blue-600 ml-1">{` +${remainingCount}`}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 px-2 "
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <ul className="space-y-1 text-xs">
              {subjects?.map((sub) => (
                <li
                  key={sub?.id}
                  className="px-2 py-1 rounded-md hover:bg-muted"
                >
                  {sub?.name} <span className="text-primary">{sub?.code}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    },
  }),
  columnHelper.accessor('teachers', {
    header: 'Professeurs',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const teachers = row.original.teachers;
      const firstTeacher = teachers?.[0];
      const remainingCount = (teachers?.length || 1) - 1;

      if (teachers && teachers.length === 0) {
        return (
          <span className="text-xs text-muted-foreground italic">
            Aucun enseignant assigné
          </span>
        );
      }
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            disabled={!remainingCount}
            asChild
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(true)}
              className="text-xs border px-2 py-1 rounded-lg hover:bg-accent transition"
            >
              {firstTeacher?.firstname} {firstTeacher?.lastname}
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
            <ul className="space-y-1 text-xs">
              {teachers?.map((t) => (
                <li key={t?.id} className="px-2 py-1 rounded-md hover:bg-muted">
                  {t?.firstname} {t?.lastname}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <ClassAction row={row} meta={table.options.meta} />
    ),
  }),
]);
