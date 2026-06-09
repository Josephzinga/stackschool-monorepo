import { Prisma } from '@stackschool/db';
import { RoleDataType } from '@stackschool/shared';
type PrismaTx = Prisma.TransactionClient;
export declare function handleRoleCreation(tx: PrismaTx, userId: string, schoolId: string, roleData: RoleDataType): Promise<void>;
export {};
//# sourceMappingURL=role.service.d.ts.map