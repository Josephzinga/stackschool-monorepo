'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SortOrder, StudentSortField } from '@stackschool/ui';
import { StudentTableActions } from './student-table-actions';
import { Features } from '@/components/table/features';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';

export type StudentsData = {
  id: string | number;
  firstName: string | null;
  lastName: string | null;
  avatarUrl?: string | null;
  level: string;
  className: string | null;
  status: boolean;
  section: string | null;
  enrollmentYear: string | null;
  matricule: string | null;
};
const columnsHelper = createColumnHelper<Features, StudentsData>();

export const columns = columnsHelper.columns([
  columnsHelper.display({
    id: 'select',
    header: ({ table }) => <HeaderCheckBox table={table} />,
    cell: ({ row }) => <CellCheckBox row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
  columnsHelper.display({
    id: 'info',
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const sort = {
              field: 'firstname' as StudentSortField,
              order: 'ASC' as SortOrder,
            };
          }}
        >
          Élèves
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const photo = row.original.avatarUrl;
      const id = row.original.id;

      return (
        <Link
          href={`/list/students/${id}`}
          className="block max-w-80 md:max-w-100 h-full group"
        >
          <div className="flex gap-2 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photo ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstName?.[0]}
                {row.original.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm text-foreground group-hover:inline-2">
              {row.original.firstName} {row.original.lastName}
            </p>
          </div>
        </Link>
      );
    },
  }),
  columnsHelper.accessor('matricule', {
    header: 'Matricule',
    cell: ({ row }) => {
      const matricule = row.original.matricule;

      return (
        <div className="w-35 h-full items-center justify-center">
          <span className="font-inter text-xs">{matricule}</span>
        </div>
      );
    },
  }),
  columnsHelper.accessor('className', {
    header: 'Classe',
    cell: ({ row }) => {
      const classeName = row.original.className;

      return <p className="text-xs xl:text-sm px-2 h-5">{classeName}</p>;
    },
  }),
  columnsHelper.accessor('section', {
    header: 'Section',
    cell: ({ row }) => {
      const section = row.original.section;
      return (
        <div>
          <p className="text-xs xl:text-sm px-2 h-5">{section || '-'}</p>
        </div>
      );
    },
  }),
  columnsHelper.accessor('level', {
    header: 'Niveau',
    cell: ({ row }) => {
      const level = row.original.level;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="font-normal text-xs">
            {level}
          </Badge>
        </div>
      );
    },
  }),
  columnsHelper.accessor('status', {
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
  columnsHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <StudentTableActions row={row} />,
  }),
]);
