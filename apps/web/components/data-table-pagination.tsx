'use client';

import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
}

export function DataTablePagination<TData>({
  table,
  isLoading,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <span>
            {table.getFilteredSelectedRowModel().rows.length} sur{' '}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </span>
        ) : (
          <span>
            {table.getFilteredRowModel().rows.length} résultat(s)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4 lg:gap-8 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium hidden sm:block">Lignes</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} /{' '}
          {table.getPageCount()}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <span className="sr-only">Précédent</span>
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            <span className="sr-only">Suivant</span>
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
