"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const registerFormSchema = zod_1.z.object({
    email: zod_1.z.email(),
    username: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string(),
    confirmPassword: zod_1.z.string(),
});
class RegisterDto extends (0, nestjs_zod_1.createZodDto)(registerFormSchema) {
}
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map