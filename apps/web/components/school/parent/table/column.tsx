import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { RelationType } from '@stackschool/shared';

export type ParentColumn = {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string | null;
  photo?: string;
  email?: string | null;
  address?: string;
  profession: string;
  contactPreference?: string;
  students: {
    id: string;
    firstname: string;
    lastname: string;
    relationType: RelationType;
    classe: {
      name: string;
      level: string;
    };
  }[];
};
export const columns: ColumnDef<ParentColumn>[] = [
  {
    accessorKey: 'info',
    header: 'Parents',
    cell: ({ row }) => {
      return (
        <Link
          href={`/list/parents/${row.original.id}`}
          className="block w-full h-full"
        >
          <div className="flex gap-3 items-center hover:bg-accent p-1 rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.original.photo} />
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
    accessorKey: 'phoneNumber',
    header: 'Numéro de tel',
  },
  {
    accessorKey: 'profession',
    header: 'Proféssion',
  },
  {
    accessorKey: 'address',
    header: 'Adresse',
  },
  {
    accessorKey: 'students',
    header: 'Enfant (s)',
    cell: ({ row }) => {},
  },
];
