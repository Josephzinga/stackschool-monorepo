'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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

export type TeacherColumns = {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  phoneNumber?: string;
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

export const columns: ColumnDef<TeacherColumns>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="cursor-pointer"
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
      const photo = row.original.photo;
      const id = row.original.id;

      return (
        <Link href={`/list/teachers/${id}`} className="block w-full h-full">
          <div className="flex gap-3 items-center hover:bg-accent p-1 rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photo} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstName?.[0]}
                {row.original.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstName} {row.original.lastName}
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
    header: 'Téléphone',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.phoneNumber || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'assignments.subject',
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
  },

  {
    accessorKey: 'assignments.class',
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
  },

  {
    accessorKey: 'weeklyHours',
    header: 'H/sem',
    cell: ({ row }) => {
      return <span>{row.original.weeklyHours} h</span>;
    },
  },
  {
    accessorKey: 'status',
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
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <TeacherTableActions row={row} />,
  },
];
