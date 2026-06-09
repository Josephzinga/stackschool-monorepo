import { ColumnDef } from '@tanstack/react-table';
type GroupColumn = {
    id: string;
    name: string;
    classes: {
        id: string;
        name: string;
    }[];
    classSubjects: {
        subject: {
            id: string;
            name: string;
            code: string;
        };
        teacher: {
            id: string;
            lastname: string;
            firstname: string;
        };
    }[];
    type?: string;
    totalCount: number;
};
export declare const columns: ColumnDef<GroupColumn>[];
export {};
//# sourceMappingURL=columns.d.ts.map