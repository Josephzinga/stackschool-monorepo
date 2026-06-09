"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deep_link_1 = require("./deep.link");
describe('Deep Link Utils', () => {
    describe('getPlateForm', () => {
        it('devrait retourner un state avec plateform="mobile" si query.plateform est "mobile"', () => {
            const req = { query: { plateform: 'mobile' } };
            const state = (0, deep_link_1.getPlateForm)(req);
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
            expect(decoded).toEqual({ plateform: 'mobile' });
        });
        it('devrait retourner un state avec plateform="web" par défaut', () => {
            const req = { query: {} };
            const state = (0, deep_link_1.getPlateForm)(req);
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
            expect(decoded).toEqual({ plateform: 'web' });
        });
    });
    describe('parseState', () => {
        it('devrait décoder correctement un state valide', () => {
            const payload = JSON.stringify({ plateform: 'mobile' });
            const state = Buffer.from(payload).toString('base64');
            const result = (0, deep_link_1.parseState)(state);
            expect(result).toEqual({ plateform: 'mobile' });
        });
        it('devrait retourner { platform: "web" } si le state est vide', () => {
            expect((0, deep_link_1.parseState)(undefined)).toEqual({ platform: 'web' });
            expect((0, deep_link_1.parseState)('')).toEqual({ platform: 'web' });
        });
        it('devrait retourner { platform: "web" } si le state est invalide', () => {
            expect((0, deep_link_1.parseState)('invalid-base64')).toEqual({ platform: 'web' });
        });
    });
});
//# sourceMappingURL=deep.link.test.js.map