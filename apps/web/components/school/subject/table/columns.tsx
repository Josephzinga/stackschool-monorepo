import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SubjectTableAction } from '@/components/school/subject/table/subject-table-action';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SubjectCategory } from '@stackschool/ui';
import { categoryMap } from '@/constant';

export type SubjectColumns = {
  id: string;
  name: string;
  category: SubjectCategory;
  classes:
    | ({
        id: string;
        name: string;
      } | null)[]
    | null
    | undefined;
  mainTeacher?: {
    id: string;
    firstname: string;
    lastname: string;
    photo?: string | null;
  } | null;
  totalWeeklyHours: number;
};

export const columns: ColumnDef<SubjectColumns>[] = [
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
    accessorKey: 'name',
    header: 'Matière.',
  },
  {
    accessorKey: 'classes',
    header: 'Classe.',
    cell: ({ row }) => {
      const classes = row.original.classes?.map((cs) => cs?.name);
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

          {remainingCount > 0 && (
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
      const photo = row.original?.mainTeacher?.photo;
      const lastname = row.original.mainTeacher?.lastname;
      const firstname = row.original.mainTeacher?.firstname;
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
                {firstname?.[0]}
                {lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm hover:underline hover:underline-offset-2 text-foreground">
                {firstname} {lastname}
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
    cell: ({ row }) => <SubjectTableAction row={row} />,
  },
];
