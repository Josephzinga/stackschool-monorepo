import { z } from 'zod';

export const GenderContract = z.literal(['MALE', 'FEMALE', 'OTHER']);

export const ProfileContract = z.object({
  id: z.uuid(),
  firstName: z.string(),
  userId: z.uuid(),
  lastName: z.string(),
  avatarUrl: z.url().nullable(),
  address: z.string().nullable(),
  gender: GenderContract.nullable(),
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

export const ValidateUserFieldInput = z
  .object({
    email: z.email().optional(),
    phoneNumber: UserContract.shape.phoneNumber.optional(),
    selfCheck: z.boolean().default(true),
    userId: z.uuid().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.selfCheck && !data.userId) {
      ctx.addIssue({
        message: 'veuillez spécifié le userId',
        path: ['userId'],
        code: 'custom',
      });
    }
  });
export type ValidateUserFieldInput = z.infer<typeof ValidateUserFieldInput>;

export const UpdateAvatarInput = z.object({
  userId: z.uuid(),
  avatarUrl: z.string("l'url est requis."),
});
export type UpdateAvatarInput = z.infer<typeof UpdateAvatarInput>;

export const ValidateUserFieldResponse = z.object({
  ok: z.boolean().default(false),
  valid: z.boolean().default(false),
  field: z.string().optional(),
  message: z.string().optional(),
});
export type ValidateUserFieldResponse = z.infer<
  typeof ValidateUserFieldResponse
>;
export type UserContract = z.infer<typeof UserContract>;

export const UserWithRelationsContract = UserContract.extend({
  profile: ProfileContract.nullable(),
  accounts: z.array(AccountContract),
});
export type UserWithRelationsContract = z.infer<
  typeof UserWithRelationsContract
>;
