import {z} from "zod";
import {profileSchema} from "../auth";

export const CreateTeacherSchema = z.object({
    firstName: z.string().min(2, 'Le prénom est requis'),
    lastName: z.string().min(2, 'Le nom est requis'),
    gender: profileSchema.shape.gender,
    email: profileSchema.shape.email,
    phoneNumber: z.string().nullable(),
    diploma: z.string().min(2, 'Le diplôme est requis'),
    specialization: z.string().min(2, 'La spécialité est requise'),
});

export type CreateTeacherSchema = z.infer<typeof CreateTeacherSchema>
