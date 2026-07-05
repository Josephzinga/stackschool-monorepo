'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityColumn,
  VisibilityState,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useAttendanceUiState } from '@/components/school/attendance/hooks/useAttendanceUiState';
import { useAttendanceEvent } from '../hooks/useAttendanceEvent';
import { useAttendanceData } from '../hooks/useAttendanceData';
import {
  MarkAttendanceFormType,
  markAttendanceSchema,
} from '@stackschool/shared';
import { toast } from 'sonner';
import { useDashboard } from '@/components/providers/dashboard-provider';
import { useWindowSize } from 'react-use';
import { useAttendanceStore } from '@/store/attendance';

export function AttendanceTable() {
  const { me } = useDashboard();
  const { date, isAutoSave, rowSelection, setRowSelection } =
    useAttendanceUiState();
  const {
    mode,
    handleMarkAttendance,
    setPagination,
    pagination,
    selectedClass,
    selectedSubject,
  } = useAttendanceEvent();
  const { rows: data, getColumns, meta, isLoading } = useAttendanceData();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const setBulkMarkCallback = useAttendanceStore((state) => state.setBulkMarkCallback);

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

  /* useEffect(() => {
    setBulkMarkCallback(async (status) => {
      const selectedIndices = data
        .map((row, index) => ({ id: row.id, index }))
        .filter((item) => rowSelection[item.id])
        .map((item) => item.index);

      if (selectedIndices.length === 0) return;

      const updatedAttendances = selectedIndices.map((idx) => {
        const row = data[idx];
        setValue(`attendances.${idx}.status`, status, { shouldDirty: true });
        setValue(`attendances.${idx}.id`, row.id);
        setValue(`attendances.${idx}.userType`, row.userType);
        setValue(`attendances.${idx}.date`, date);

        return {
          id: row.id,
          status: status,
          userType: row.userType,
          date: date,
          isSubjectMode: me?.schoolContext?.role === 'TEACHER',
          subjectId: selectedSubject,
        };
      });

      if (isAutoSave) {
        await handleMarkAttendance({
          attendances: updatedAttendances,
        });
      }

      setRowSelection({});
    });

    return () => {
      setBulkMarkCallback(null);
    };
  }, [
    data,
    rowSelection,
    isAutoSave,
    setValue,
    date,
    handleMarkAttendance,
    setRowSelection,
    setBulkMarkCallback,
  ]); */

  const table = useReactTable({
    data,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
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
      columnVisibility,
    },
  });

  const { width } = useWindowSize();

  useEffect(() => {
    if (width < 600) {
      setColumnVisibility({
        class: false,
      });
    }
  }, [width]);

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
      className="space-y-4 w-full"
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
