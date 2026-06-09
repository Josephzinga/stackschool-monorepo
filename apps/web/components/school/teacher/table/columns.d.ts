import { ColumnDef } from '@tanstack/react-table';
export type TeacherColumns = {
    id: string | number;
    firstname: string;
    lastname: string;
    email: string;
    photo?: string;
    phoneNumber?: string;
    status: boolean;
    assignments: ({
        subject: {
            id: string;
            name: string;
        } | undefined;
        class: {
            id: string;
            name: string;
        };
    } | undefined)[];
    weeklyHours?: number;
};
export declare const columns: ColumnDef<TeacherColumns>[];
//# sourceMappingURL=columns.d.ts.map