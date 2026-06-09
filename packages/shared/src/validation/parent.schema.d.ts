import { z } from 'zod';
import { RelationTypeEnum } from './complete-profile.schema';
export declare const createParentSchema: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    profession: z.ZodString;
    address: z.ZodString;
    children: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        relationType: z.ZodEnum<typeof RelationTypeEnum>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateParentFormData = z.infer<typeof createParentSchema>;
//# sourceMappingURL=parent.schema.d.ts.map