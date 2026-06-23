import { create } from 'zustand';
import { AttendanceMode } from '@/types/attendance';
import { format } from 'date-fns';

interface AttendanceState {
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
}
const now = format(new Date(), 'yyyy-MM-dd');

export const useAttendanceStore = create<AttendanceState>((set) => ({
  isAutoSave: true,

  setIsAutoSave: (value) => set({ isAutoSave: value }),

  isScannerOpen: false,
  setScannerOpen: (open) => set({ isScannerOpen: open }),

  qrDialogUser: null,
  setQrDialogUser: (user) => set({ qrDialogUser: user }),

  date: new Date(now),
  setDate: (date) => set({ date }),

  tenantId: 'tenant-1', // Récupérer depuis le contexte auth
}));
