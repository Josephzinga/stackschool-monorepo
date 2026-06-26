'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useAttendanceStore } from '@/store/attendance';
import { useAttendanceEvent } from '../hooks/useAttendanceEvent';
import { useAttendanceData } from '../hooks/useAttendanceData';
import {
  MarkAttendanceFormType,
  markAttendanceSchema,
} from '@stackschool/shared';
import { toast } from 'sonner';
import { useDashboard } from '@/components/providers/dashboard-provider';

export function AttendanceTable() {
  const { me } = useDashboard();
  const { date, isAutoSave, rowSelection, setRowSelection } =
    useAttendanceStore();
  const {
    mode,
    handleMarkAttendance,
    setPagination,
    pagination,
    selectedClass,
    selectedSubject,
  } = useAttendanceEvent();
  const { rows: data, getColumns, meta, isLoading } = useAttendanceData();

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    reset,
    watch,
    formState: { dirtyFields, errors, isValid },
  } = useForm<MarkAttendanceFormType>({
    resolver: zodResolver(markAttendanceSchema),
  });
  useEffect(() => {
    reset({
      attendances: data.map((row) => ({
        id: row.id,
        status: row.status,
        classId: row.class?.id,
        userType: row.userType,
        date,
        isSubjectMode: me?.schoolContext?.role === 'TEACHER',
        subjectId: selectedSubject,
      })),
    });
  }, [selectedClass, mode, data, selectedSubject]);

  const table = useReactTable({
    data,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    rowCount: meta?.total,
    getRowId: (row: any) => row.id,
    meta: {
      trigger,
      control,
      setValue,
      canMark:
        me?.schoolContext?.role === 'TEACHER'
          ? !!selectedClass && !!selectedSubject
          : true,
      onCellChange: async (rowIndex, data) => {
        setValue(`attendances.${rowIndex}.id`, data.id);
        setValue(`attendances.${rowIndex}.userType`, data.userType);
        setValue(`attendances.${rowIndex}.date`, date);

        if (isAutoSave) {
          onSubmit({
            attendances: [getValues(`attendances.${rowIndex}`)],
          });
        }
      },
    },
    state: {
      pagination,
      rowSelection,
    },
  });

  function onSubmit(data: MarkAttendanceFormType) {
    const changedAttendances = data.attendances.filter((att, index) => {
      const isStatusDirty = dirtyFields.attendances?.[index]?.status;
      return isStatusDirty && (att.status !== null || att.status !== undefined);
    });

    if (changedAttendances.length === 0) {
      toast.info('Aucun changement détecté.');
      return;
    }

    handleMarkAttendance({
      attendances: changedAttendances,
    });
  }
  return (
    <form
      id="attendance-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="rounded-md border">
        <AppDataTable
          table={table}
          columns={getColumns()}
          isLoading={isLoading}
        />
      </div>
      <DataTablePagination table={table} />
    </form>
  );
}
