"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSession = createUserSession;
const db_1 = require("@stackschool/db");
const config_1 = require("../constant/config");
const outils_1 = require("../lib/outils");
async function createUserSession(userId) {
    const refreshToken = (0, outils_1.generateToken)(16);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * config_1.SESSION_EXPIRES_DAY);
    const session = await db_1.prisma.session.create({
        data: {
            userId,
            sessionToken: refreshToken,
            expires,
        },
    });
    return { refreshToken, expires, session };
}
//# sourceMappingURL=session.service.js.map