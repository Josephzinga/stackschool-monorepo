import { UserWithRelationsContract } from '@stackschool/messaging';
import { Account, Profile, User } from '../prisma/db/generated/client';

export type UserWithRelations = User & {
  profile?: Profile | null;
  accounts: Account[];
};

export function toUserWithRelationsContract(
  user: any,
): UserWithRelationsContract {
  return {
    id: user.id,
    email: user.email,
    username: user.username!,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    hasMembership: user.hasMembership ?? false,
    emailVerified: user.emailVerified ?? false,
    profileCompleted: !!user.profileCompleted,
    profile: user?.profile
      ? {
          id: user.profile.id,
          userId: user.id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatarUrl: user.profile.avatarUrl,
          gender: user.profile.gender!,
          address: user.profile.address!,
        }
      : null,
    accounts: user?.accounts?.map((a) => ({ id: a.id, provider: a.provider })),
  };
}
