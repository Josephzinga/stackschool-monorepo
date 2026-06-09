import { ColumnDef } from '@tanstack/react-table';
import { Gender, StudentStatus } from '@stackschool/ui';
export type ClassStudentTable = {
    id: string;
    studentNumber: number;
    firstname: string;
    lastname: string;
    photo?: string;
    gender: Gender;
    matricule: string;
    paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
    status: StudentStatus;
    attendanceStatus: 'EXCELLENT' | 'GOOD' | 'POOR';
};
export declare const columns: ColumnDef<ClassStudentTable>[];
//# sourceMappingURL=columns.d.ts.map