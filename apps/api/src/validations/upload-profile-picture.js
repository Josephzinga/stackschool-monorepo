"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadedImageSchema = void 0;
const shared_1 = require("@stackschool/shared");
exports.uploadedImageSchema = shared_1.z.object({
    file: shared_1.z.object({
        mimetype: shared_1.z
            .string()
            .refine((v) => ['image/jpeg', 'image/png', 'image/webp', 'image/svg'].includes(v), {
            message: 'Format invalide (jpeg, png, webp, svg)',
        }),
        size: shared_1.z
            .number()
            .max(5 * 1024 * 1024, { message: 'La taille maximale est de 5MB' }),
        filename: shared_1.z.string(),
    }),
    body: shared_1.z.object({
        isOncompleteProfile: shared_1.z.boolean().optional(),
        profileId: shared_1.z.cuid(),
    }),
});
//# sourceMappingURL=upload-profile-picture.js.map