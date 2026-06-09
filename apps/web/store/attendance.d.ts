import { AttendanceMode } from '@/types/attendance';
interface AttendanceState {
    mode: AttendanceMode;
    setMode: (mode: AttendanceMode) => void;
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    isScannerOpen: boolean;
    setScannerOpen: (open: boolean) => void;
    qrDialogUser: {
        id: string;
        name: string;
        type: AttendanceMode;
    } | null;
    setQrDialogUser: (user: {
        id: string;
        name: string;
        type: AttendanceMode;
    } | null) => void;
    date: Date;
    setDate: (date: Date) => void;
    tenantId: string;
    resetFilters: () => void;
}
export declare const useAttendanceStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AttendanceState>>;
export {};
//# sourceMappingURL=attendance.d.ts.map