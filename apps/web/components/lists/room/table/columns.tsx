'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import * as React from 'react';
import { RoomFeatures } from '@/components/lists/room/table/data-table';
import {
  CellCheckBox,
  HeaderCheckBox,
} from '@/components/table/table-checkbox';
import RoomAction from '@/components/lists/room/table/room.actions';
import { RoomType, roomTypeConstant } from '@stackschool/contracts';

export type RoomData = {
  id: string;
  name: string | null;
  capacity?: number | null;
  type?: RoomType;
  code?: string | null;
  defaultForClass: {
    id: string;
    name: string;
  };
  class?: {
    id: string;
    name: string;
  };
};
const helper = createColumnHelper<RoomFeatures, RoomData>();
export const columns = helper.columns([
  helper.display({
    id: 'select',
    header: ({ table }) => <HeaderCheckBox table={table} />,
    cell: ({ row }) => <CellCheckBox row={row} />,
  }),
  helper.accessor('name', {
    header: 'Salle',
    cell: ({ row }) => {
      return (
        <div className="pl-2">
          <span key={row.original?.id}>{row.original?.name}</span>
        </div>
      );
    },
  }),
  helper.accessor('capacity', {
    header: 'Capacité',
  }),
  helper.accessor('type', {
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original?.type;
      if (!type)
        return (
          <span className="font-inter italic opacity-80">Non définie.</span>
        );
      return <Badge variant="outline">{roomTypeConstant[type]}</Badge>;
    },
  }),
  helper.accessor('class', {
    header: 'Classe occupé',
    cell: ({ row }) => {
      const classe = row.original?.defaultForClass;

      if (!classe?.id)
        return (
          <span className="font-inter italic opacity-80">Non assigné</span>
        );
      return (
        <div>
          <Badge variant="secondary">{classe.name}</Badge>
        </div>
      );
    },
  }),
  helper.accessor('code', {
    header: 'Code',
  }),
  helper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <RoomAction row={row} meta={table.options.meta} />
    ),
  }),
]);
