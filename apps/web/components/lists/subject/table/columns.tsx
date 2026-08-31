import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SubjectTableAction } from '@/components/lists/subject/table/subject-table-action';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SubjectCategory } from '@stackschool/ui';
import { categoryMap } from '@/constant';
import { SubjectFeatures } from './data-table';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';

export type SubjectColumns = {
  id: string;
  name: string;
  category: SubjectCategory;
  classes: (
    | ({
        id: string;
        name: string;
      } | null)[]
    | null
    | undefined
  )[];
  mainTeacher?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  } | null;
  totalWeeklyHours: number;
};

export const columns: ColumnDef<SubjectFeatures, SubjectColumns>[] = [
  {
    id: 'select',
    header: ({ table }) => <HeaderCheckBox table={table} />,
    cell: ({ row }) => <CellCheckBox row={row} />,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Matière.',
  },
  {
    accessorKey: 'classes',
    header: 'Classe.',
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

          {remainingCount > 0 && classes?.length > 0 && (
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
    accessorKey: 'mainTeacher',
    header: 'Professeur.',
    cell: ({ row }) => {
      const photo = row.original?.mainTeacher?.avatarUrl;
      const lastName = row.original.mainTeacher?.lastName;
      const firstName = row.original.mainTeacher?.firstName;
      if (!row.original.mainTeacher?.id)
        return (
          <span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>
        );
      return (
        <Link
          href={`/list/teachers/${row?.original?.mainTeacher?.id}`}
          className="block w-full h-full"
        >
          <div className="flex gap-3 items-center p-1 rounded-md transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photo ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {firstName?.[0]}
                {lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm hover:underline hover:underline-offset-2 text-foreground">
                {firstName} {lastName}
              </span>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
    cell: ({ row }) => {
      const category = row.original?.category;

      return (
        <Badge className="text-xs font-medium font-sans">
          {categoryMap.find((c) => c.value === category)?.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'totalWeeklyHours',
    header: 'H/sem.',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <SubjectTableAction row={row} meta={table.options.meta} />
    ),
  },
];
