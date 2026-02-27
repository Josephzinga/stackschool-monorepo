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
import { TeacherTableActions } from './teacher-table-actions';
import { Gender } from '@stackschool/ui';

export type Teacher = {
  id: string | number;
  firstname: string;
  lastname: string;
  email: string;
  photo?: string;
  phoneNumber?: string;
  specialization: string[];
  diploma: string;
  gender: Gender;
  status: boolean;
  classes: { id: string; name: string }[];
};

export const columns: ColumnDef<Teacher>[] = [
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
    accessorKey: 'specialization',
    header: 'Spécialité',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.specialization.map((spec, i) => (
          <Badge key={i} variant="outline" className="font-normal text-xs">
            {spec}
          </Badge>
        ))}
      </div>
    ),
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
    accessorKey: 'classes',
    header: 'Classes',
    cell: ({ row }) => {
      const classes = row.original.classes;
      if (!classes || classes.length === 0)
        return <span className="text-muted-foreground text-xs">-</span>;

      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {classes.slice(0, 2).map((cls) => (
            <Badge
              key={cls.id}
              variant="outline"
              className="px-1.5 text-[12px] h-5"
            >
              {cls.name}
            </Badge>
          ))}
          {classes.length > 2 && (
            <Badge variant="outline" className="text-[12px] px-1.5 h-5">
              +{classes.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <TeacherTableActions row={row} />,
  },
];
