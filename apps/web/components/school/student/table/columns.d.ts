import { ColumnDef } from '@tanstack/react-table';
export type StudentColumns = {
    id: string | number;
    firstname: string | null;
    lastname: string | null;
    email?: string;
    phoneNumber?: string;
    level: string;
    className: string | null;
    photo?: string | null;
    status: boolean;
    section: string | null;
    enrollmentYear: string | null;
    matricule: string | null;
};
export declare const columns: ColumnDef<StudentColumns>[];
//# sourceMappingURL=columns.d.ts.map