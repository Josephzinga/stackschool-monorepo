"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeValidateSchema = safeValidateSchema;
function safeValidateSchema(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return { errors, success: false };
    }
    return { data: result.data, success: true };
}
//# sourceMappingURL=validate-schema.util.js.map