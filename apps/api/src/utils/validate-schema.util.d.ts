import { ZodSchema } from 'zod';
interface SafeValidateSchemaResult<T> {
    success: boolean;
    data?: T;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
export declare function safeValidateSchema<T>(schema: ZodSchema<T>, data: unknown): SafeValidateSchemaResult<T>;
export {};
//# sourceMappingURL=validate-schema.util.d.ts.map