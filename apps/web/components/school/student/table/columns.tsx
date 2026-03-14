'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTable } from './table-provider';
import { SortOrder, StudentSortField } from '@stackschool/ui';
import { StudentTableActions } from './student-table-actions';

export type StudentColumns = {
  id: string | number;
  firstname: string | null;
  lastname: string | null;
  email?: string;
  phoneNumber?: string;
  level: string;
  className: string | null;
  photo?: string | null;
  status: boolean;
  section: string | null;
  enrollmentYear: string | null;
  matricule: string | null;
};

export const columns: ColumnDef<StudentColumns>[] = [
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
    header: () => {
      const { setFilters } = useTable();

      return (
        <Button
          variant="ghost"
          onClick={() => {
            const sort = {
              field: 'firstname' as StudentSortField,
              order: 'ASC' as SortOrder,
            };
            setFilters((prev) => ({ ...prev, sort }));
          }}
        >
          Élèves
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const photo = row.original.photo;
      const id = row.original.id;

      return (
        <Link
          href={`/list/students/${id}`}
          className="block max-w-80 md:max-w-100 h-full"
        >
          <div className="flex gap-2 items-center hover:bg-accent rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photo ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstname?.[0]}
                {row.original.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstname} {row.original.lastname}
              </span>
              <span className="text-xs tracking-tight md:tracking-normal text-wrap text-muted-foreground">
                {row.original.email || row.original.phoneNumber}
              </span>
            </div>
          </div>
        </Link>
      );
    },
  },

  {
    accessorKey: 'matricule',
    header: 'Matricule',
    cell: ({ row }) => {
      const matricule = row.original.matricule;

      return (
        <div className="w-35 h-full items-center justify-center">
          <span className="font-inter text-xs">{matricule}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'className',
    header: 'Classe',
    cell: ({ row }) => {
      const classeName = row.original.className;

      return <p className="text-xs xl:text-sm px-2 h-5">{classeName}</p>;
    },
  },
  {
    accessorKey: 'section',
    header: 'Section',
    cell: ({ row }) => {
      const section = row.original.section;
      return (
        <div>
          <p className="text-xs xl:text-sm px-2 h-5">{section || '-'}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'level',
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
  },
  {
    accessorKey: 'enrollmentYear',
    header: 'Inscription',
    cell: ({ row }) => {
      const enrollmentYear = row.original.enrollmentYear;
      return <Badge className="bg-primary/40">{enrollmentYear}</Badge>;
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
    accessorKey: 'actions',
    cell: ({ row }) => <StudentTableActions row={row} />,
  },
];
