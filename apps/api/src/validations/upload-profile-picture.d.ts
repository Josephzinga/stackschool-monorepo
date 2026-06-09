import { z } from '@stackschool/shared';
export declare const uploadedImageSchema: z.ZodObject<{
    file: z.ZodObject<{
        mimetype: z.ZodString;
        size: z.ZodNumber;
        filename: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        isOncompleteProfile: z.ZodOptional<z.ZodBoolean>;
        profileId: z.ZodCUID;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=upload-profile-picture.d.ts.map