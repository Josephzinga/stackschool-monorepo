"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validations/validate");
describe('validateLogin', () => {
    it('devrait retourner des erreurs pour des données invalides', () => {
        const invalidData = {
            identifier: '',
            password: '',
        };
        const errors = (0, validate_1.validateLogin)(invalidData);
        expect(errors).toBeDefined();
        expect(Array.isArray(errors)).toBe(true);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('field');
        expect(errors[0]).toHaveProperty('message');
    });
    it('devrait retourner undefined pour des données valides', () => {
        const validData = {
            identifier: 'tests@example.com',
            password: 'password123',
        };
        const errors = (0, validate_1.validateLogin)(validData);
        expect(errors).toBeUndefined();
    });
});
//# sourceMappingURL=validate.test.js.map