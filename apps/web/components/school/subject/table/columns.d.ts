import { ColumnDef } from '@tanstack/react-table';
import { SubjectCategory } from '@stackschool/ui';
export type SubjectColumns = {
    id: string;
    name: string;
    category: SubjectCategory;
    classes: (({
        id: string;
        name: string;
    } | null)[] | null | undefined)[];
    mainTeacher?: {
        id: string;
        firstname: string;
        lastname: string;
        photo?: string | null;
    } | null;
    totalWeeklyHours: number;
};
export declare const columns: ColumnDef<SubjectColumns>[];
//# sourceMappingURL=columns.d.ts.map