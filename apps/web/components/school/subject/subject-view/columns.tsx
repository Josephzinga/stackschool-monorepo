'use client';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { SubjectViewAction } from '@/components/school/subject/subject-view/subject-view-action';

export type SubjectColumns = {
  id: string;
  coefficient: number | null;
  weeklyHours: number;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  teacher: {
    id: string;
    user: {
      profile: {
        firstname: string;
        lastname: string;
      };
    };
  };
} | null;

export const columns: ColumnDef<SubjectColumns>[] = [
  {
    accessorKey: 'subject.name',
    header: 'Matière',
    cell: ({ row }) => (
      <div className="font-medium ml-2 font-inter text-sm">
        {row.original?.subject?.name}
        <span className="ml-2 text-xs text-muted-foreground">
          [{row.original?.subject.code}]
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'coefficient',
    header: 'Coeff.',
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-medium font-inter">
        {row.original?.coefficient || 0}
      </Badge>
    ),
  },
  {
    accessorKey: 'weeklyHours',
    header: 'Heures/Semaine',
    cell: ({ row }) => (
      <span className="text-sm">{row.original?.weeklyHours || 0}h</span>
    ),
  },
  {
    accessorKey: 'teacher',
    header: 'Enseignant',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original?.teacher?.user?.profile?.lastname || 'Non assigné'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <SubjectViewAction row={row} meta={table.options.meta} />
    ),
  },
];
