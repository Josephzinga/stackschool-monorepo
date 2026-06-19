'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AttendanceFormType,
  attendanceSchema,
} from '@/app/(routes)/list/attendances/page1';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AttendanceMode } from '@/types/attendance';
import { AttendanceStatus } from '@stackschool/ui';
import { z } from 'zod';

interface AttendanceTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
}

export const attendanceFormSchema = z.object({
  classId: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      userType: z.enum(['STUDENT', 'TEACHER', 'STAFF']),
      status: z.enum(AttendanceStatus),
    }),
  ),
});

export function AttendanceTable<T>({
  columns,
  data,
  isLoading,
}: AttendanceTableProps<T>) {
  const methods = useForm<AttendanceFormType>({
    resolver: zodResolver(attendanceSchema),
  });

  const [currentStatus, setCurrentStatus] = useState<
    Array<{ id: string; userType: AttendanceMode; status: AttendanceStatus }>
  >([]);

  const { handleSubmit } = methods;
  const queryClient = useQueryClient();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      onAttendanceStatusChange: (data, status) => {
        queryClient.getQueryData(['']);
        setCurrentStatus((prev) => [
          ...prev,
          { id: data?.id, userType: data?.userType, status },
        ]);
        console.log(data, 'status', status);
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
  });
  console.log('currentStatus', currentStatus);
  const onSubmit = (data: AttendanceFormType) => {
    handleSubmit(currentStatus);
  };
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="rounded-md border">
          <AppDataTable table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </div>
    </form>
  );
}
