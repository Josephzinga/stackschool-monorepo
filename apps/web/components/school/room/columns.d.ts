import { ColumnDef } from '@tanstack/react-table';
export type RoomColumns = {
    id: string;
    name: string | null;
    capacity?: number | null;
    type?: string | null;
    code?: string | null;
    defaultForClass: {
        id: string;
        name: string;
    };
    class?: {
        id: string;
        name: string;
    };
} | null;
export declare const columns: ColumnDef<RoomColumns>[];
//# sourceMappingURL=columns.d.ts.map