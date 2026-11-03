'use client';

import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { AttendanceMode, AttendanceRow } from '@/types/attendance';
import type { AttendanceFeatures } from './manual-attendance-table';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';
import { ProfileCell } from '@/components/table/profile-cell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { AttendanceCell } from './attendance-cell';
import { format } from 'date-fns';

const helper = createColumnHelper<AttendanceFeatures, AttendanceRow>();
type AttendanceColumn = ColumnDef<AttendanceFeatures, AttendanceRow, any>;

export function getAttendanceColumns(mode: AttendanceMode) {
  const columns: AttendanceColumn[] = [
    helper.display({
      id: 'select',
      header: ({ table }) => <HeaderCheckBox table={table} />,
      cell: ({ row }) => <CellCheckBox row={row} />,
    }),
    helper.accessor('profile', {
      header:
        mode === 'STUDENT'
          ? 'Élève'
          : mode === 'TEACHER'
            ? 'Enseignant'
            : 'Personnel',
      cell: ({ row }) => (
        <ProfileCell
          href={`/list/${mode.toLowerCase()}/${row.original.id}`}
          profile={row.original.profile!}
        />
      ),
    }),
  ];

  if (mode === 'STUDENT') {
    columns.push(
      helper.accessor('class', {
        header: 'Classe',
        cell: ({ row }) =>
          row.original.class ? (
            <Badge variant="secondary">{row.original.class.name}</Badge>
          ) : null,
      }),
    );
  }

  if (mode === 'TEACHER') {
    columns.push(
      helper.accessor('class', {
        header: 'Classe',
        cell: ({ row }) =>
          row.original.class ? (
            <Badge variant="secondary">{row.original.class.name}</Badge>
          ) : null,
      }),
    );
  }

  if (mode === 'STAFF') {
    columns.push(
      helper.accessor('role', {
        header: 'Rôle',
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
      }),
    );
  }

  columns.push(
    helper.accessor('status', {
      header: 'Statut de présence',
      cell: ({ row, table }) => <AttendanceCell row={row} table={table} />,
    }),
    helper.display({
      id: 'time',
      header: 'Date/heure',
      cell: ({ row }) => {
        const checkInTime = row.original?.time?.checkInTime;
        return (
          <div>
            {checkInTime ? (
              <span>heure: {format(checkInTime, 'HH:mm')}</span>
            ) : (
              ''
            )}
          </div>
        );
      },
    }),
  );

  // Colonne QR pour Teacher et Staff
  if (mode !== 'STUDENT') {
    columns.push(
      helper.display({
        id: 'qr',
        header: 'QR',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              // Sera géré par useAttendanceEvent
            }}
          >
            <QrCode className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
        ),
      }),
    );
  }

  return columns as ColumnDef<AttendanceFeatures, AttendanceRow>[];
}
