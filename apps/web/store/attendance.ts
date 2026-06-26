import { create } from 'zustand';
import { AttendanceMode } from '@/types/attendance';
import { format } from 'date-fns';
import { RowSelectionState, OnChangeFn } from '@tanstack/react-table';

interface AttendanceStore {
  // Dialog scanner
  isScannerOpen: boolean;
  setScannerOpen: (open: boolean) => void;

  // Dialog QR Code
  qrDialogUser: { id: string; name: string; type: AttendanceMode } | null;
  setQrDialogUser: (
    user: { id: string; name: string; type: AttendanceMode } | null,
  ) => void;

  date: Date;
  setDate: (date: Date) => void;

  // Tenant
  tenantId: string;
  isAutoSave: boolean;
  setIsAutoSave: (value: boolean) => void;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
}
const now = format(new Date(), 'yyyy-MM-dd');

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  isAutoSave: true,
  date: new Date(now),
  isScannerOpen: false,
  qrDialogUser: null,
  rowSelection: {},

  setRowSelection: (rowSelection) => {
    if (typeof rowSelection === 'function') {
      const row = rowSelection(get().rowSelection);
      set({ rowSelection: row });
    }
  },
  setIsAutoSave: (value) => set({ isAutoSave: value }),

  setScannerOpen: (open) => set({ isScannerOpen: open }),

  setQrDialogUser: (user) => set({ qrDialogUser: user }),

  setDate: (date) => set({ date }),

  tenantId: 'tenant-1', // Récupérer depuis le contexte auth
}));
