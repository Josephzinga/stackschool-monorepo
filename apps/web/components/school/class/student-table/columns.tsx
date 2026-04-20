'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ColumnDef } from '@tanstack/react-table';
import { Gender, StudentStatus } from '@stackschool/ui';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import Link from 'next/link';
import ClassStudentAction from '@/components/school/class/student-table/class-action';

export type ClassStudentTable = {
  id: string;
  studentNumber: number;
  firstname: string;
  lastname: string;
  photo?: string;
  gender: Gender;
  matricule: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  status: StudentStatus;
  attendanceStatus: 'EXCELLENT' | 'GOOD' | 'POOR';
};

export const columns: ColumnDef<ClassStudentTable>[] = [
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
    accessorKey: 'studentNumber',
    header: 'N°',
    cell: ({ row }) => {
      return <span>{row.original.studentNumber}</span>;
    },
  },
  {
    accessorKey: 'user.profile',
    header: 'Élève',
    cell: ({ row }) => {
      return (
        <Link
          href={`/list/students/${row.original.id}`}
          className="block max-w-80 md:max-w-100 h-full"
        >
          <div className="flex gap-2 items-center hover:bg-accent rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.original.photo ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstname?.[0]}
                {row.original.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.firstname} {row.original.lastname}
              </span>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'gender',
    header: 'Sexe',
    cell: ({ row }) => {
      return <div>{row.original.gender}</div>;
    },
  },
  {
    accessorKey: 'matricule',
    header: 'Matricule',
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.matricule}</Badge>;
    },
  },
  {
    accessorKey: 'attendanceStatus',
    header: 'Présence',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'ACTIVE' ? 'success' : 'outline'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <ClassStudentAction row={row} meta={table.options.meta} />
    ),
  },
];
