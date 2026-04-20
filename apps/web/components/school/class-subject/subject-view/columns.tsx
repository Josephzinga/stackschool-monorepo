'use client';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { SubjectViewAction } from '@/components/school/class-subject/subject-view/subject-view-action';

export type SubjectColumns = {
  id: string;
  coefficient: number | null;
  weeklyHours: number;
  subject: {
    id: string;
    name: string;
    code: string;
  } | null;
  teacher: {
    id: string;
    user?: {
      profile: {
        firstname: string;
        lastname: string;
      };
    };
  } | null;
} | null;

export const columns: ColumnDef<SubjectColumns>[] = [
  {
    accessorKey: 'subject.name',
    header: 'Matière',
    cell: ({ row }) => (
      <div className="font-medium ml-2 font-inter text-sm">
        {row.original?.subject?.name}
        <span className="ml-2 text-xs text-muted-foreground">
          [{row.original?.subject?.code}]
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'coefficient',
    header: 'Coefficient',
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-medium font-inter">
        {row.original?.coefficient || 0}
      </Badge>
    ),
  },
  {
    accessorKey: 'weeklyHours',
    header: 'H/S',
    cell: ({ row }) => (
      <span className="text-sm font-semibold">
        {row.original?.weeklyHours || 0} h
      </span>
    ),
  },
  {
    accessorKey: 'teacher',
    header: 'Enseignant',
    cell: ({ row }) => {
      const profile = row.original?.teacher?.user?.profile;
      if (!profile)
        return (
          <span className="italic opacity-80 text-[12px]">Non assigné</span>
        );
      return (
        <span className="text-sm">
          {profile?.firstname} {profile?.lastname}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <SubjectViewAction row={row} meta={table.options.meta} />
    ),
  },
];
