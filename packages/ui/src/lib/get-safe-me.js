"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeMe = getSafeMe;
const shared_1 = require("@stackschool/shared");
async function getSafeMe() {
    try {
        const me = await shared_1.authServices.getMe();
        if (me.ok) {
            return me.user ?? null;
        }
    }
    catch (err) {
        const status = err.status ?? (0, shared_1.parseAxiosError)(err).status;
        if (status === 401) {
            try {
                const refresh = await shared_1.authServices.refresh();
                if (refresh.ok) {
                    const me2 = await shared_1.authServices.getMe();
                    return me2.user ?? null;
                }
            }
            catch (refreshErr) {
                const error = (0, shared_1.parseAxiosError)(refreshErr);
                console.log('Echec du refresh token:', error.message);
            }
        }
    }
    return null;
}
//# sourceMappingURL=get-safe-me.js.map