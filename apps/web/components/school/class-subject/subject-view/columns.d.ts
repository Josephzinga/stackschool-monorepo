import { ColumnDef } from '@tanstack/react-table';
export type SubjectColumns = {
    id: string;
    coefficient: number | null;
    weeklyHours: number;
    subject: {
        id: string;
        name: string;
        code: string;
    } | null;
    teacher: {
        id: string;
        user?: {
            profile: {
                firstname: string;
                lastname: string;
            };
        };
    } | null;
} | null;
export declare const columns: ColumnDef<SubjectColumns>[];
//# sourceMappingURL=columns.d.ts.map