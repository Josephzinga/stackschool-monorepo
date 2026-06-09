"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const db_1 = require("@stackschool/db");
const router = (0, express_1.Router)();
router.get('/me', auth_1.isAuthenticated, async (req, res) => {
    const user = req.user;
    if (!user)
        return;
    let provider = null;
    for (const p of user.Account) {
        if (p.provider) {
            provider = p.provider;
        }
    }
    const roleData = db_1.prisma.schoolUser.findUnique({
        where: {
            schoolId_userId: { schoolId: '', userId: user?.id },
        },
    });
    return res.json({
        ok: true,
        user: {
            email: user.email ?? null,
            id: user?.id,
            username: user.username,
            phoneNumber: user.phoneNumber,
            profileCompleted: user.profileCompleted,
            provider,
            profile: user.profile ?? null,
            hasMembership: user.hasMembership,
        },
    });
});
exports.default = router;
//# sourceMappingURL=me.route.js.map