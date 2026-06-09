"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const limiter_1 = require("./limiter");
describe('Rate Limiter Utils', () => {
    describe('consumeIp', () => {
        it("devrait rejeter si l'IP est manquante", async () => {
            const req = { ip: undefined };
            await expect((0, limiter_1.consumeIp)(req)).rejects.toThrow('Missing IP');
        });
        it('devrait consommer des points pour une IP valide', async () => {
            const req = { ip: '127.0.0.1' };
            await expect((0, limiter_1.consumeIp)(req)).resolves.toBeDefined();
        });
    });
    describe('consumeIdentifier', () => {
        it("devrait rejeter si l'identifiant est manquant", async () => {
            const req = { body: {} };
            await expect((0, limiter_1.consumeIdentifier)(req)).rejects.toThrow('Missing identifier');
        });
        it('devrait consommer des points pour un identifiant valide', async () => {
            const req = { body: { identifier: 'tests-user' } };
            await expect((0, limiter_1.consumeIdentifier)(req)).resolves.toBeDefined();
        });
    });
    describe('consumeCode', () => {
        it("devrait rejeter si l'IP est manquante", async () => {
            const req = { ip: undefined };
            await expect((0, limiter_1.consumeCode)(req)).rejects.toThrow('IP manquants');
        });
    });
    describe('consumeResendCode', () => {
        it("devrait rejeter si l'IP est manquante", async () => {
            const req = { ip: undefined };
            await expect((0, limiter_1.consumeResendCode)(req)).rejects.toThrow('IP manquants dans resend_code');
        });
    });
});
//# sourceMappingURL=limiter.test.js.map