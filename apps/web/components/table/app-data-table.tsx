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

interface AppDataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: TableType<TFeatures, TData>;
  isLoading?: boolean;
  columns: ColumnDef<TFeatures, TData>[];
}

export default function AppDataTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>({ table, columns, isLoading }: AppDataTableProps<TFeatures, TData>) {
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
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              data-state={row.getIsSelected() && 'selected'}
              className="h-16 even:bg-slate-50 dark:even:bg-gray-950 hover:dark:even:bg-slate-950 "
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {isLoading ? 'Chargement...' : 'Aucun résultat.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
