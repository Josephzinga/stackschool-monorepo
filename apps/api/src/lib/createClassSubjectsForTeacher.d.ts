import { Prisma } from '@stackschool/db';
type PrismaTx = Prisma.TransactionClient;
export declare const createClassSubjectsForTeacher: ({ classSubjects, tx, teacherId, }: {
    classSubjects: {
        classId: string;
        subjectIds: string[];
    }[];
    tx: PrismaTx;
    teacherId?: string;
}) => Promise<void>;
export {};
//# sourceMappingURL=createClassSubjectsForTeacher.d.ts.map