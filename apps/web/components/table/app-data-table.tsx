import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CellData,
  ColumnDef,
  FlexRender,
  RowData,
  Table as TableType,
  TableFeatures,
} from '@tanstack/react-table';
import * as React from 'react';
import { LoaderOne } from '@/components/ui/loader';

interface AppDataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: TableType<TFeatures, TData>;
  isLoading?: boolean;
  columns: ColumnDef<TFeatures, TData>[];
  emptyComponent?: React.ReactNode;
}

export default function AppDataTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>({
  table,
  columns,
  isLoading,
  emptyComponent,
}: AppDataTableProps<TFeatures, TData>) {
  return (
    <Table className="px-2 overflow-x-auto">
      <TableHeader>
        {table?.getHeaderGroups()?.map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="h-10 bg-slate-100 dark:bg-slate-900"
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="font-semibold px-1 md:px-2 font-inter text-md whitespace-nowrap"
                >
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {/* 1. Si l'application charge les données, on affiche UNIQUEMENT le loader */}
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <LoaderOne />
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          // 2. Si on a des lignes de données, on les affiche normalement
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="h-16 even:bg-slate-50 dark:even:bg-gray-950 hover:dark:even:bg-slate-950"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          // 3. Si aucune ligne n'est présente ET que le chargement est fini
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 p-2! text-center"
            >
              {/* On vérifie si la table indique un total de 0 ligne au serveur */}
              {emptyComponent && table.getRowCount() === 0
                ? emptyComponent
                : 'Aucune donnée trouvée.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
