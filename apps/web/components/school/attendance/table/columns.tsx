'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import { AttendanceStatus } from '@stackschool/ui';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mode } from '@/app/(routes)/list/attendances/page';

export type AttendanceColumns = {
  id: string;
  profile: {
    firstname: string;
    lastname: string;
    photo?: string;
  };
  status: AttendanceStatus;
  class?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  }[];
  mode: Mode;
};

export const studentColumns: ColumnDef<AttendanceColumns>[] = [
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
    accessorKey: 'profile',
    header: ({ column, header, table }) => {
      console.log('column', column, '\n header', header);
      return <div>Élèves</div>;
    },
    cell: ({ row }) => {
      const { firstname, lastname, photo } = row.original.profile;
      const mode = row.original.mode;
      return (
        <Link
          href={`/list/students/${row.original.id}`}
          className="block max-w-80 md:max-w-100 h-full"
        >
          <div className="flex gap-2 items-center hover:bg-accent rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photo ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {firstname?.[0]}
                {lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {firstname} {lastname}
              </span>
            </div>
          </div>
        </Link>
      );
    },
    size: 300,
  },
  {
    accessorKey: 'class',
    header: 'Classe',
    cell: ({ row }) => <div>{row.original.class?.name}</div>,
    size: 150,
  },
  {
    id: 'status',
    header: 'Statut de Présence',
    cell: ({ row, table }) => {
      const studentId = row.original.id;
      return (
        <RadioGroup
          defaultValue={AttendanceStatus.Present}
          onValueChange={(val) => console.log('radioGroup value', val)}
          className="flex gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={AttendanceStatus.Present}
              id={`p-${studentId}`}
              className="bg-green-500"
            />
            <Label htmlFor={`p-${studentId}`}>P</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={AttendanceStatus.Absent}
              id={`a-${studentId}`}
              className="bg-red-500"
            />
            <Label htmlFor={`a-${studentId}`}>A</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={AttendanceStatus.Late}
              id={`a-${studentId}`}
              className="bg-yellow-400"
            />
            <Label htmlFor={`a-${studentId}`}>R</Label>
          </div>
        </RadioGroup>
      );
    },
    size: 400,
  },
];
