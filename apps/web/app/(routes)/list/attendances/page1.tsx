'use client';
import React, { useMemo } from 'react';
import { AttendanceTable } from '@/components/school/attendance/table/manual-attendace-table';
import { Button } from '@/components/ui/button';
import { useAttendanceData } from '@/components/school/attendance/hooks/useAttendanceData';
import { QrCode } from 'lucide-react';
import { useAttendanceEvent } from '@/components/school/attendance/hooks/useAttendanceEvent';

export function AttendanceDashboard() {
  const { handleStatusChange, openQrDialog } = useAttendanceEvent();
  const { rows: data, getColumns, classes, isLoading } = useAttendanceData();

  // Construction finale des colonnes avec les handlers d'événements
  const dynamicColumns = useMemo<ReturnType<typeof getColumns>>(() => {
    return getColumns().map((col) => {
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
                  `${row.original?.profile?.firstName} ${row.original?.profile?.lastName}`,
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
  }, [getColumns, handleStatusChange, openQrDialog]);

  return (
    <AttendanceTable
      columns={dynamicColumns}
      data={data}
      isLoading={isLoading}
    />
  );
}
