import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  Table as TableType,
} from '@tanstack/react-table';
import * as React from 'react';

interface AppDataTableProps<TData> {
  table: TableType<TData>;
  isLoading?: boolean;
  columns: ColumnDef<TData>[];
}

export default function AppDataTable<TData>({
  table,
  columns,
  isLoading,
}: AppDataTableProps<TData>) {
  return (
    <Table>
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
                  className="font-semibold px-1 md:px-2 font-inter text-md whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
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
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="h-16 even:bg-slate-50 dark:even:bg-gray-950 hover:dark:even:bg-slate-950 "
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
