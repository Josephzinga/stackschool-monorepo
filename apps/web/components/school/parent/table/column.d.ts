import { ColumnDef } from '@tanstack/react-table';
import { RelationTypeEnum } from '@stackschool/shared';
export type ParentColumn = {
    id: string;
    firstname: string;
    lastname: string;
    phoneNumber?: string | null;
    photo?: string;
    email?: string | null;
    address?: string;
    profession: string;
    contactPreference?: string;
    students: {
        id: string;
        firstname: string;
        lastname: string;
        relationType: RelationTypeEnum;
        classe: {
            name: string;
            level: string;
        };
    }[];
};
export declare const columns: ColumnDef<ParentColumn>[];
//# sourceMappingURL=column.d.ts.map