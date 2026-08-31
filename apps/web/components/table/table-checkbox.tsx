import { Row, RowData, Table, TableFeatures } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';

interface CheckBoxHeaderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TFeatures, TData>;
}

interface CheckBoxCellProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  row: Row<TFeatures, TData>;
}

export function HeaderCheckBox<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({ table }: CheckBoxHeaderProps<TFeatures, TData>) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}
export function CellCheckBox<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({ row }: CheckBoxCellProps<TFeatures, TData>) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}
