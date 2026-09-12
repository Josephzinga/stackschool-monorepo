import { z } from 'zod';
import { profileSchema } from '../auth';
import { StaffPosition } from './enums.contract';

export const CreateStaffSchema = z.object({
  firstName: profileSchema.shape.firstName,
  lastName: profileSchema.shape.lastName,
  email: profileSchema.shape.email,
  phoneNumber: profileSchema.shape.phoneNumber,
  gender: profileSchema.shape.gender,
  position: StaffPosition,
  department: z.string().optional(),
});

export const UpdateStaffSchema = z.object({
  id: z.string(),
  firstName: profileSchema.shape.firstName.optional(),
  lastName: profileSchema.shape.lastName.optional(),
  email: profileSchema.shape.email,
  phoneNumber: profileSchema.shape.phoneNumber,
  gender: profileSchema.shape.gender.optional(),
  position: StaffPosition.optional(),
  department: z.string().optional(),
});
export type UpdateStaffSchema = z.infer<typeof UpdateStaffSchema>;
export type CreateStaffSchema = z.infer<typeof CreateStaffSchema>;
