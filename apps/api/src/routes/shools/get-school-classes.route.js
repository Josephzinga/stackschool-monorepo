"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_errors_1 = require("../../utils/api-errors");
const db_1 = require("@stackschool/db");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/:schoolId/classes', auth_1.isAuthenticated, async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;
        const { pageIndex = 0, limit = 10 } = req.query;
        const skip = pageIndex * limit;
        if (!schoolId) {
            return next((0, api_errors_1.createServiceError)("L'id manquant", 400));
        }
        const classes = await db_1.prisma.class.findMany({
            where: {
                schoolId,
            },
            select: {
                id: true,
                section: true,
                name: true,
                level: true,
                createdAt: true,
            },
            skip,
            take: Number(limit),
        });
        if (!classes || classes.length <= 0) {
            return res.status(200).json({ ok: true, classes: [] });
        }
        return res.status(200).json({ ok: true, classes });
    }
    catch (e) {
        next((0, api_errors_1.createServiceError)('Erreur lors de la recherche des classes', 500, e));
    }
});
exports.default = router;
//# sourceMappingURL=get-school-classes.route.js.map