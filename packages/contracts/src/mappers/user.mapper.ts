import {UserWithRelationsContract} from '../auth';

export function toUserWithRelationsContract<T>(
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
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
            userId: user.profile?.userId,
          avatarUrl: user.profile.avatarUrl,
          gender: user.profile.gender!,
          address: user.profile.address!,
        }
      : null,
    accounts: user?.accounts?.map((a: { provider: string; id: string }) => ({
      id: a.id,
      provider: a.provider,
    })),
  };
}
