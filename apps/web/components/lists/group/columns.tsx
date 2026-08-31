'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

type GroupColumn = {
  id: string;
  name: string;
  classes: {
    id: string;
    name: string;
  }[];
  classSubjects: {
    subject: {
      id: string;
      name: string;
      code: string;
    };
    teacher: {
      id: string;
      lastname: string;
      firstname: string;
    };
  }[];
  type?: string;
  totalCount: number;
};

export const columns: ColumnDef<GroupColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Groupe',
  },
  {
    accessorKey: 'classes',
    header: 'Classes',
    cell: ({ row }) => {
      const classes = row.original?.classes;
      const twoFirst = classes?.splice(0, 3);
      return (
        <div>
          {twoFirst.map((cls) => (
            <Badge key={cls?.id}>{cls?.name}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'classSubjects.subject',
    header: 'Matières',
    cell: ({ row }) => {
      return (
        <div>
          {row.original?.classSubjects?.map((cls) => (
            <Badge key={cls?.subject?.id}>{cls?.subject?.name}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'classSubject.teacher',
    header: 'Enseignant',
  },
  {
    accessorKey: 'totalCount',
    header: 'Total élèves',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
];
