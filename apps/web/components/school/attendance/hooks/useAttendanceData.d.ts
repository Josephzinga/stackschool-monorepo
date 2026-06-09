import { ColumnDef } from '@tanstack/react-table';
export declare function useAttendanceData(): {
    rows: AttendanceRow[];
    columns: ColumnDef<AttendanceRow>[];
    classes: {
        __typename?: "Class";
        id: string;
        level: string;
        name: string;
        section?: string | null;
        group?: {
            __typename?: "Group";
            id: string;
            name: string;
            type?: import("@stackschool/ui").GroupType | null;
        } | null;
    }[];
    isLoading: boolean;
    isError: boolean;
};
//# sourceMappingURL=useAttendanceData.d.ts.map