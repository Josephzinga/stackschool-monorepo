import { createColumnHelper } from '@tanstack/react-table';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ParentActions } from '@/components/lists/parent/table/parent-actions';
import { ParentFeatures } from '@/components/lists/parent/table/data-table';
import { RelationType, relationTypeConstant } from '@stackschool/contracts';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';
import { ProfileCell } from '@/components/table/profile-cell';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Gender } from '@stackschool/ui';

export type ParentData = {
  id: string;
  userId?: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  gender?: Gender;
  contact: {
    phoneNumber?: string | null;
    email?: string | null;
  };
  address?: string;
  profession: string;
  contactPreference?: string;
  students: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    relationType: RelationType;
    classe: {
      name: string;
      level: string;
    };
  }[];
};

const helper = createColumnHelper<ParentFeatures, ParentData>();

export const columns = helper.columns([
  helper.display({
    id: 'select',
    header: ({ table }) => <HeaderCheckBox table={table} />,
    cell: ({ row }) => <CellCheckBox row={row} />,
  }),

  helper.accessor('profile', {
    header: 'Parent',
    cell: ({ row }) => (
      <ProfileCell
        profile={row.original.profile}
        href={`/list/parent/${row.original.id}`}
      />
    ),
  }),

  helper.accessor('contact', {
    header: 'Contacts',
    cell: ({ row }) => {
      const { phoneNumber, email } = row.original.contact || {};
      return (
        <div className="flex flex-col gap-0.5">
          {phoneNumber && (
            <p className="text-sm hover:text-blue-600 transition-colors">
              <span className="font-medium text-gray-500">📱 </span>
              {phoneNumber}
            </p>
          )}
          {email && (
            <p className="text-sm hover:text-blue-600 transition-colors">
              <span className="font-medium text-gray-500">✉️ </span>
              {email}
            </p>
          )}
          {!phoneNumber && !email && (
            <p className="text-sm text-gray-400 italic">Aucun contact</p>
          )}
        </div>
      );
    },
  }),

  helper.accessor('profession', {
    header: 'Profession',
    cell: ({ row }) => {
      return (
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
          {row.original.profession || 'Non renseigné'}
        </span>
      );
    },
  }),

  helper.accessor('students', {
    header: 'Enfant(s)',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(
        null,
      );
      const student = row.original.students || [];
      const firstStudent = student[0];
      const remainingCount = student.length - 1;

      // Gestion de l'ouverture avec délai
      const handleMouseEnter = () => {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          setHoverTimeout(null);
        }
        setOpen(true);
      };

      const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
          setOpen(false);
        }, 300); // Délai plus court et plus prévisible
        setHoverTimeout(timeout);
      };

      // Nettoyage du timeout
      useEffect(() => {
        return () => {
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
          }
        };
      }, [hoverTimeout]);

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            render={
              <button
                onClick={() => setOpen(!open)}
                className="text-xs border px-3 py-1.5 rounded-lg hover:bg-accent hover:border-primary transition-all duration-200 flex items-center gap-1"
              >
                {firstStudent ? (
                  <>
                    <span>
                      {firstStudent.firstName} {firstStudent.lastName}
                    </span>
                    {remainingCount > 0 && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                        +{remainingCount}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Aucun enfant</span>
                )}
              </button>
            }
          />
          <PopoverContent
            className="max-w-72 px-2 py-2 flex flex-col gap-1 shadow-lg border"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sideOffset={5}
          >
            {student?.map((s) => (
              <Item
                key={s.id}
                className="border border-border bg-gray-50 dark:bg-gray-900 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <ItemMedia>
                  <Avatar className="size-12 ring-2 ring-transparent hover:ring-primary transition-all duration-200">
                    <AvatarImage src={s?.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {s.firstName?.[0]}
                      {s.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="flex flex-col gap-0.5!">
                  <ItemTitle className="group">
                    <Link
                      href={`/list/student/${s.id}`}
                      className="hover:underline hover:text-primary transition-colors duration-200 font-medium"
                    >
                      {s.firstName} {s.lastName}
                    </Link>
                  </ItemTitle>
                  <ItemDescription className="text-xs! text-gray-500 dark:text-gray-400">
                    <span className="inline-flex text-xs! items-center gap-1">
                      <span className="font-medium">Classe:</span>
                      {s.classe?.name || 'Non assigné'}
                    </span>
                  </ItemDescription>
                  <ItemDescription className="text-xs! p-0 text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium">Relation:</span>
                      {relationTypeConstant[s.relationType]}
                    </span>
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </PopoverContent>
        </Popover>
      );
    },
  }),

  helper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <ParentActions row={row} meta={table.options.meta} />
    ),
  }),
]);
