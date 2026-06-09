"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_errors_1 = require("./api-errors");
const shared_1 = require("@stackschool/shared");
describe('createServiceError', () => {
    it('devrait créer une ServiceError avec le message et le code de statut donnés', () => {
        const message = 'Test error';
        const statusCode = 400;
        const error = (0, api_errors_1.createServiceError)(message, statusCode);
        expect(error).toBeInstanceOf(shared_1.ServiceError);
        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(statusCode);
        expect(error.details).toBeUndefined();
    });
    it('devrait utiliser le code de statut 500 par défaut', () => {
        const message = 'Default error';
        const error = (0, api_errors_1.createServiceError)(message);
        expect(error.statusCode).toBe(500);
    });
    it('devrait inclure les détails si fournis', () => {
        const message = 'Detailed error';
        const details = { field: 'test' };
        const error = (0, api_errors_1.createServiceError)(message, 422, details);
        expect(error.details).toEqual(details);
    });
});
//# sourceMappingURL=api-error.test.js.map