import { create } from 'zustand';
import { AttendanceMode } from '@/types/attendance';

interface AttendanceState {
  // Mode actif
  mode: AttendanceMode;
  setMode: (mode: AttendanceMode) => void;

  // Filtre classe (uniquement pour les élèves)
  selectedClass: string | null;
  setSelectedClass: (classId: string | null) => void;

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

  // Reset filtres quand on change de mode
  resetFilters: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  mode: 'STUDENT',
  setMode: (mode) =>
    set((state) => {
      // Reset la classe si on quitte le mode STUDENT
      if (mode !== 'STUDENT') {
        return { mode, selectedClass: null };
      }
      return { mode };
    }),

  selectedClass: null,
  setSelectedClass: (classId) => set({ selectedClass: classId }),

  isScannerOpen: false,
  setScannerOpen: (open) => set({ isScannerOpen: open }),

  qrDialogUser: null,
  setQrDialogUser: (user) => set({ qrDialogUser: user }),

  date: new Date(),
  setDate: (date) => set({ date }),

  tenantId: 'tenant-1', // Récupérer depuis le contexte auth

  resetFilters: () => set({ selectedClass: null }),
}));
