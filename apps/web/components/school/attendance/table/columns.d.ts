import { ColumnDef } from '@tanstack/react-table';
import { AttendanceStatus } from '@stackschool/ui';
import { Mode } from '@/app/(routes)/list/attendances/page';
export type AttendanceColumns = {
    id: string;
    profile: {
        firstname: string;
        lastname: string;
        photo?: string;
    };
    status: AttendanceStatus;
    class?: {
        id: string;
        name: string;
    };
    subject?: {
        id: string;
        name: string;
    }[];
    mode: Mode;
};
export declare const studentColumns: ColumnDef<AttendanceColumns>[];
//# sourceMappingURL=columns.d.ts.map