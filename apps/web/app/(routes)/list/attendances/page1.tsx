'use client';
import React, { useMemo } from 'react';
import { AttendanceTable } from '@/components/school/attendance/manual-attendace-table';
import { Button } from '@/components/ui/button';
import { useAttendanceData } from '@/components/school/attendance/hooks/useAttendanceData';
import { QrCode } from 'lucide-react';
import { useAttendanceEvent } from '@/components/school/attendance/hooks/useAttendanceEvent';
import { AttendanceStatus } from '@stackschool/ui';
import { z } from 'zod';

export const attendanceSchema = z.array(
  z.object({
    id: z.string(),
    status: z.enum(AttendanceStatus),
    userType: z.enum(['TEACHER', 'STUDENT', 'STAFF']),
  }),
);
export type AttendanceFormType = z.infer<typeof attendanceSchema>;
export function AttendanceDashboard() {
  const { handleStatusChange, openQrDialog } = useAttendanceEvent();
  const {
    rows: data,
    columns: baseColumns,
    classes,
    isLoading,
  } = useAttendanceData();

  // Construction finale des colonnes avec les handlers d'événements
  const dynamicColumns = useMemo<typeof baseColumns>(() => {
    return baseColumns.map((col) => {
      // Injecter le handler QR pour Teacher et Staff
      if (col.id === 'qr') {
        return {
          ...col,
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                openQrDialog(
                  row.original.id,
                  `${row.original.profile.firstName} ${row.original.profile.lastName}`,
                  row.original.userType,
                )
              }
            >
              <QrCode className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
          ),
        };
      }

      return col;
    });
  }, [baseColumns, handleStatusChange, openQrDialog]);

  return <AttendanceTable columns={dynamicColumns} data={data} />;
}
