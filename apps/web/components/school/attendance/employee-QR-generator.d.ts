import { AttendanceMode } from '@/types/attendance';
interface QRCodeDialogProps {
    user: {
        id: string;
        name: string;
        type: AttendanceMode;
    } | null;
    onClose: () => void;
}
export declare function QRCodeDialog({ user, onClose }: QRCodeDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=employee-QR-generator.d.ts.map