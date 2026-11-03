import '@tanstack/react-table';
import type { ColumnDef, RowData, TableFeatures } from '@tanstack/react-table';
import type { MarkAttendanceSchema } from '@stackschool/contracts';
import type { Control, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import type { PaginationMeta } from '@stackschool/ui';

export interface AppDataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  columns: ColumnDef<TFeatures, TData>[];
  data: TData[];
  isLoading: boolean;
  meta?: Omit<PaginationMeta, 'page'>;
}
export interface AppTableMeta<TData extends RowData> {
  openEdit?: (data: TData) => void;
  openDelete?: (data: TData) => void;
  openAdd?: (data: TData) => void;
  onChange?: (data: TData) => void;
  onCellChange?: (rowIndex: number, data: TData, status: any) => void;
  control?: Control<MarkAttendanceSchema>;
  trigger?: UseFormTrigger<MarkAttendanceSchema>;
  setValue?: UseFormSetValue<MarkAttendanceSchema>;
  canMark?: boolean;
}
