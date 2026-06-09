"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.post("/logout", async (req, res, next) => {
    try {
        const refreshToken = req.cookies["refresh_token"];
        if (refreshToken) {
            await prisma_1.prisma.session.deleteMany({
                where: { sessionToken: refreshToken },
            });
            res.clearCookie("refresh_token");
        }
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy((destroyErr) => {
                if (destroyErr)
                    return next(destroyErr);
                res.clearCookie("sid");
                res.json({ ok: true });
            });
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=logout.route.js.map