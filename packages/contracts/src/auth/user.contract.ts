import { z } from 'zod';

export const ProfileContract = z.object({
  id: z.uuid(),
  firstname: z.string().nullable(),
  lastname: z.string().nullable(),
  avatarUrl: z.url().nullable(),
  address: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});
export type ProfileContract = z.infer<typeof ProfileContract>;

export const AccountContract = z.object({
  id: z.uuid(),
  provider: z.string(),
});
export type AccountContract = z.infer<typeof AccountContract>;

export const UserContract = z.object({
  id: z.uuid(),
  email: z.email().nullable(),
  username: z.string(),
  phoneNumber: z.string().nullable(),
  emailVerified: z.boolean(),
  profileCompleted: z.boolean(),
  hasMembership: z.boolean(),
  isActive: z.boolean(),
});
export type UserContract = z.infer<typeof UserContract>;

export const UserWithRelationsContract = UserContract.extend({
  profile: ProfileContract.nullable(),
  accounts: z.array(AccountContract),
});
export type UserWithRelationsContract = z.infer<
  typeof UserWithRelationsContract
>;
