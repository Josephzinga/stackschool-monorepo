import '@tanstack/react-table';
import type { ColumnDef, RowData } from '@tanstack/react-table';
import { AttendanceStatus, PaginationMeta } from '@stackschool/ui';
import { Control, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { MarkStudentAttendanceFormType } from '@/components/school/attendance/table/manual-attendance-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    openEdit?: (data: TData) => void;
    openDelete?: (data: TData) => void;
    openAdd?: (data: TData) => void;
    onChange?: (data: TData) => void;
    onCellChange?: (
      rowIndex: number,
      data: TData,
      status: AttendanceStatus,
    ) => void;
    control?: Control<MarkStudentAttendanceFormType>;
    setValue?: UseFormSetValue<MarkStudentAttendanceFormType>;
    trigger?: UseFormTrigger<MarkStudentAttendanceFormType>;
  }
}
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  meta?: Omit<PaginationMeta, 'page'>;
}
