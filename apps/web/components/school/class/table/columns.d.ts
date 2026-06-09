import { ColumnDef } from '@tanstack/react-table';
export type ClassData = {
    id: string;
    name: string;
    level: string;
    section?: string | null;
    teachers?: Array<{
        id: string;
        lastname?: string | null;
        firstname?: string | null;
    } | null> | null;
    subjects?: Array<{
        id: string | null;
        name: string | null;
        code?: string | null;
    } | null> | null | undefined;
    supervisor?: {
        id?: string;
        profile: {
            firstname?: string | null;
            lastname?: string | null;
            photo?: string | null;
        };
    } | null;
    _count: {
        students: number;
        teachers?: number | null;
        subjects?: number | null;
    } | null;
};
export declare const columns: ColumnDef<ClassData>[];
//# sourceMappingURL=columns.d.ts.map