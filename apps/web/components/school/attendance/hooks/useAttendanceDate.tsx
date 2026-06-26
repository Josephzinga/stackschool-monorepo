import { useCallback } from 'react';
import { useAttendanceStore } from '@/store/attendance';
import type { AttendanceMode } from '@/types/attendance';

type QrDialogUser = { id: string; name: string; type: AttendanceMode } | null;

export function useAttendanceDate() {
  const {
    date,
    setDate,
    isAutoSave,
    setIsAutoSave,
    rowSelection,
    setRowSelection,
    isScannerOpen,
    setScannerOpen,
    qrDialogUser,
    setQrDialogUser,
    tenantId,
  } = useAttendanceStore();

  const openScanner = useCallback(() => setScannerOpen(true), [setScannerOpen]);
  const closeScanner = useCallback(() => setScannerOpen(false), [setScannerOpen]);
  const closeQrDialog = useCallback(() => setQrDialogUser(null), [setQrDialogUser]);

  return {
    date,
    setDate,
    isAutoSave,
    setIsAutoSave,
    rowSelection,
    setRowSelection,
    isScannerOpen,
    openScanner,
    closeScanner,
    qrDialogUser,
    setQrDialogUser,
    closeQrDialog,
    tenantId,
  } as const;
}
