import { StaffFormSchema, SchoolUserContract } from '@stackschool/contracts';
import { z } from 'zod';

export const FindManyMemberInput = z.object({
  ids: z.array(z.string()),
});

export const FindManyMemberResponse = z.object({
  members: z.array(SchoolUserContract),
});

export const FindManyByUserIdInput = z.object({
  userIds: z.array(z.string()),
});

export const FindBySchoolIdAndUserIdInput = z.object({
  schoolId: z.uuid(),
  userId: z.uuid(),
});

export type FindBySchoolIdAndUserIdInput = z.infer<
  typeof FindBySchoolIdAndUserIdInput
>;
export type FindManyByUserIdInput = z.infer<typeof FindManyByUserIdInput>;
export type FindManyMemberInput = z.infer<typeof FindManyMemberInput>;
export type FindManyMemberResponse = z.infer<typeof FindManyMemberResponse>;
