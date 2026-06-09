import { Prisma, SchoolRole } from '@stackschool/db';
import { SchoolDataType } from '@stackschool/shared';
type PrismaTx = Prisma.TransactionClient;
export declare function handleSchoolCreation(tx: PrismaTx, userId: string, schoolData: SchoolDataType, role: SchoolRole): Promise<string>;
export {};
//# sourceMappingURL=school.service.d.ts.map