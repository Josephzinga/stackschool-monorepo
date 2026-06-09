import { Prisma } from '@stackschool/db';
import { ProfileData } from '@stackschool/shared';
type PrismaTx = Prisma.TransactionClient;
export declare function handleProfileUpdate(tx: PrismaTx, userId: string, profileData: ProfileData): Promise<void>;
export {};
//# sourceMappingURL=profile.service.d.ts.map