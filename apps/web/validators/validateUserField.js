"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserFieldSchema = void 0;
const shared_1 = require("@stackschool/shared");
exports.validateUserFieldSchema = shared_1.z
    .object({
    email: shared_1.z.string().email().optional(),
    phoneNumber: shared_1.z.string().min(8, "Numéro invalide").optional(),
})
    .superRefine(async (data, ctx) => {
    const params = new URLSearchParams(data);
});
//# sourceMappingURL=validateUserField.js.map