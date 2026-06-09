"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMobileSession = createMobileSession;
const session_service_1 = require("../services/session.service");
const jwt_service_1 = require("../services/jwt.service");
async function createMobileSession(user) {
    const { refreshToken, expires } = await (0, session_service_1.createUserSession)(user.userId);
    return {
        accessToken: (0, jwt_service_1.createJwtForUser)(user),
        refreshToken,
        expires,
    };
}
//# sourceMappingURL=mobile-session.js.map