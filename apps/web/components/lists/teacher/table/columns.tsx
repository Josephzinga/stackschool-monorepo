'use client';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TeacherTableActions } from './teacher-table-actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TeacherFeatures } from '@/components/lists/teacher/table/data-table';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';
import { AvatarProfile } from '@/components/profile-avatar';

export type TeachersData = {
  id: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  contact: {
    phoneNumber?: string;
    email?: string;
  };
  status: boolean;
  assignments: (
    | {
        subject: { id: string; name: string } | undefined;
        class: { id: string; name: string };
      }
    | undefined
  )[];
  weeklyHours?: number;
};

const columnHelper = createColumnHelper<TeacherFeatures, TeachersData>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => <HeaderCheckBox table={table} />,
    cell: ({ row }) => <CellCheckBox row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('profile', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Enseignant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profile = row.original.profile;

      return (
        <AvatarProfile
          profile={profile}
          href={`/list/teachers/${row.original.id}`}
        />
      );
    },
  }),
  columnHelper.accessor('contact', {
    header: 'Contact',
    cell: ({ row }) => (
      <div>
        <p>{row.original.contact?.phoneNumber}</p>
        <p>{row.original.contact?.email} </p>
      </div>
    ),
  }),
  columnHelper.accessor('assignments.subject', {
    header: () => (
      <div>
        <p className="font-inter font-semibold">Matières.</p>
      </div>
    ),
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const subjects = [
        ...new Set(row.original.assignments?.map((ass) => ass?.subject?.name)),
      ];

      if (subjects?.length === 0)
        return (
          <span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>
        );

      const firstSubject = subjects[0];
      const remainingCount = subjects.length - 1;
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
              {firstSubject}
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
              {subjects.map((c, index) => (
                <li
                  key={`sub-${index}`}
                  className="px-2 py-1 rounded-md hover:bg-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    },
  }),
  columnHelper.accessor('assignments.class', {
    header: 'Classes',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const classes = [
        ...new Set(
          row.original.assignments
            ?.map((ass) => ass?.class?.name?.trim())
            ?.filter(Boolean),
        ),
      ];

      if (classes.length === 0) {
        return (
          <span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>
        );
      }

      const firstClass = classes[0];
      const remainingCount = classes.length - 1;

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
              {firstClass}
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
              {classes.map((c, index) => (
                <li key={index} className="px-2 py-1 rounded-md hover:bg-muted">
                  {c}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    },
  }),
  columnHelper.accessor('weeklyHours', {
    header: 'H/sem',
    cell: ({ row }) => {
      return <span>{row.original.weeklyHours} h</span>;
    },
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={cn(
            'font-medium px-2 py-0.5 text-xs border-0',
            row.original.status
              ? 'bg-chart-4/10 text-chart-4 ring-1 ring-green-600/20'
              : 'bg-destructive/10 text-destructive ring-1 ring-red-600/20',
          )}
        >
          {row.original.status ? 'Actif' : 'Inactif'}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <TeacherTableActions row={row} meta={table.options.meta} />
    ),
  }),
]);
