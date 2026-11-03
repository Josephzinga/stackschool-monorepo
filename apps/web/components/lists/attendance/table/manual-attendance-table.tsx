'use client';

import {
  columnFilteringFeature,
  columnVisibilityFeature,
  ColumnVisibilityState,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/table/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useAttendanceUiState } from '@/components/lists/attendance/hooks/useAttendanceUiState';
import { useAttendanceEvent } from '../hooks/useAttendanceEvent';
import { useAttendanceData } from '../hooks/useAttendanceData';
import { MarkAttendanceSchema } from '@stackschool/contracts';
import { toast } from 'sonner';
import { useDashboard } from '@/components/providers/dashboard-provider';
import { useWindowSize } from 'react-use';
import { useAttendanceStore } from '@/store/attendance';
import { AppTableMeta } from '@/types/tanstack-table';
import { AttendanceRow } from '@/types/attendance';
import { getAttendanceColumns } from './columns';

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
    tableMeta: metaHelper<AppTableMeta<AttendanceRow>>(),
});

export type AttendanceFeatures = typeof features;

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
  const { rows: data, meta, isLoading } = useAttendanceData();
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const setBulkMarkCallback = useAttendanceStore(
    (state) => state.setBulkMarkCallback,
  );

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    reset,
    watch,
    formState: { dirtyFields, errors, isValid },
  } = useForm<MarkAttendanceSchema>({
    resolver: zodResolver(MarkAttendanceSchema),
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

  const table = useTable({
    data,
    features,
    columns: getAttendanceColumns(mode),
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
        setValue(`attendances.${rowIndex}.userType`, data?.userType);
        setValue(`attendances.${rowIndex}.date`, date);

        if (isAutoSave) {
          onSubmit({
            attendances: [getValues(`attendances.${rowIndex}`)],
          });
        }
      },
    } as AppTableMeta<AttendanceRow>,
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

  function onSubmit(data: MarkAttendanceSchema) {
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
          columns={getAttendanceColumns(mode)}
          isLoading={isLoading}
        />
      </div>
      <DataTablePagination table={table} />
    </form>
  );
}
