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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type TeacherColumns = {
  id: string | number;
  firstname: string;
  lastname: string;
  email: string;
  photo?: string;
  phoneNumber?: string;
  specialization: string[];
  status: boolean;
  classes?: { id: string; name: string }[][];
  subjects?: ({ id: string; name: string } | null | undefined)[];
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
    accessorKey: 'subjects',
    header: () => (
      <div>
        <p className="font-inter font-semibold">Matières.</p>
      </div>
    ),
    cell: ({ row }) => {
      const subjects = [
        ...new Set(row.original.subjects?.map((cl) => cl?.name)),
      ];
      if (subjects?.length === 0)
        return (
          <span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>
        );
      return (
        <div className="flex flex-wrap gap-1">
          {subjects.map((sub, i) => (
            <Badge key={i} variant="outline" className="font-normal text-xs">
              {sub}
            </Badge>
          ))}
        </div>
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
      const classes = row.original.classes?.map((cls) =>
        cls?.map((cl) => cl?.name),
      );
      const displayCount = 2;
      let remainingCount = 0;
      if (classes) {
        remainingCount = classes?.length - displayCount;
      }
      if (classes?.length === 0)
        return (
          <span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>
        );
      return (
        <div className="flex items-center gap-1">
          {classes?.slice(0, displayCount).map((className, index) => (
            <Badge
              key={index}
              variant="outline"
              className="whitespace-nowrap text-xs"
            >
              {className}
            </Badge>
          ))}

          {remainingCount > 0 && classes && classes?.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs bg-accent px-1.5 py-0.5 rounded cursor-help">
                    + {remainingCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {classes?.slice(displayCount).join(', ')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <TeacherTableActions row={row} />,
  },
];
