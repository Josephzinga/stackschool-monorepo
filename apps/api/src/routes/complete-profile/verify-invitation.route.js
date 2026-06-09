"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const db_1 = require("@stackschool/db");
const router = (0, express_1.Router)();
router.post('/verify-invitation', auth_1.isAuthenticated, async (req, res, next) => {
    const { invitationCode } = req.body;
    const userId = req.user?.id;
    if (!userId)
        return;
    try {
        const invitation = await db_1.prisma.invite.findUnique({
            where: {
                code: invitationCode,
            },
        });
    }
    catch (e) { }
});
exports.default = router;
//# sourceMappingURL=verify-invitation.route.js.map