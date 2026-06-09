import { AttendanceMode } from '@/types/attendance';
import { AttendanceStatus } from '@stackschool/ui';
export declare function useAttendanceEvent(): {
    mode: any;
    selectedClass: string;
    isScannerOpen: any;
    qrDialogUser: any;
    date: any;
    handleSwitchMode: (mode: AttendanceMode) => Promise<void>;
    handleSelectClass: (classId: string | null) => void;
    openScanner: () => void;
    closeScanner: () => void;
    openQrDialog: (id: string, name: string, type: AttendanceMode) => void;
    closeQrDialog: () => void;
    handleStatusChange: (userId: string, userType: AttendanceMode, status: AttendanceStatus) => void;
    handleBadgeScan: (badgeId: string) => void;
    search: string;
    setSearch: (value: string | ((old: string) => string | null) | null, options?: import("nuqs", { with: { "resolution-mode": "import" } }).Options) => Promise<URLSearchParams>;
    isMarking: boolean;
    isScanning: boolean;
};
//# sourceMappingURL=useAttendanceEvent.d.ts.map