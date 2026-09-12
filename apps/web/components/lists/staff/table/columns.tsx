'use client';

import { ProfileCell } from '@/components/table/profile-cell';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import type { StaffFeatures } from './data-table';
import { StaffPosition, staffPositonConstant } from '@stackschool/contracts';
import { STAFF_POSITION_CLASS } from '@/constant';
import { StaffTableActions } from '@/components/lists/staff/table/staff-table-actions';

export type StaffData = {
  id: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  contact: {
    email?: string;
    phoneNumber?: string;
  };
  department?: string;
  position: StaffPosition;
  hireDate?: Date | string;
  salary?: number;
  status: boolean;
};

const columnHelper = createColumnHelper<StaffFeatures, StaffData>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => <HeaderCheckBox table={table} />,
    cell: ({ row }) => <CellCheckBox row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('profile', {
    id: 'info',
    header: ({ column }) => (
      <Button variant="ghost">
        Personnel <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <ProfileCell
        href={`/list/staff/${row.original.id}`}
        profile={row.original.profile}
      />
    ),
  }),
  columnHelper.accessor('contact', {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
      const contact = row.original.contact;
      return (
        <div className="flex text-xs flex-col gap-0.5 h-full">
          <span>{contact.phoneNumber ?? 'joseph@gmail.com'}</span>
          <span className="">{contact?.email}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('department', {
    header: 'Département',
    cell: ({ row }) => row.original.department || 'Non renseigné',
  }),
  columnHelper.accessor('position', {
    header: 'Poste',
    cell: ({ row }) => {
      return (
        <div>
          <Badge className={STAFF_POSITION_CLASS[row.original.position]}>
            {staffPositonConstant[row.original.position]}
          </Badge>
        </div>
      );
    },
  }),
  columnHelper.accessor('hireDate', {
    header: "Date d'embauche",
    cell: ({ row }) =>
      row.original.hireDate
        ? new Date(row.original.hireDate).toLocaleDateString('fr-FR')
        : 'Non renseignée',
  }),
  columnHelper.accessor('salary', {
    header: 'Salaire',
    cell: ({ row }) =>
      row.original.salary == null
        ? 'Non renseigné'
        : new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(row.original.salary),
  }),
  columnHelper.accessor('status', {
    header: 'Statut',
    cell: ({ row }) => (
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
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <StaffTableActions data={row.original} meta={table.options.meta} />
    ),
  }),
]);
