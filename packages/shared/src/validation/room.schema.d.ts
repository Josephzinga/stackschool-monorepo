import z from 'zod';
export declare const createRoomSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodCUID>;
    name: z.ZodString;
    capacity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    type: z.ZodOptional<z.ZodString>;
    defaultClassId: z.ZodOptional<z.ZodCUID>;
    code: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
//# sourceMappingURL=room.schema.d.ts.map