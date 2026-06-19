import '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { AttendanceStatus, PaginationMeta } from '@stackschool/ui';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    openEdit?: (data: TData) => void;
    openDelete?: (data: TData) => void;
    openAdd?: (data: TData) => void;
    onChange?: (data: TData) => void;
    onAttendanceStatusChange?: (data: TData, status?: AttendanceStatus) => void;
  }
}
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  meta?: Omit<PaginationMeta, 'page'>;
}
