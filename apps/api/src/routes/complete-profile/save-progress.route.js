"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const redis_1 = require("../../lib/redis");
const shared_1 = require("@stackschool/shared");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const router = (0, express_1.Router)();
router.post('/save-progress', auth_1.isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { step, school, profile, role } = req.body;
        if (profile) {
            const { success, errors } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.profileSchema, profile);
            if (!success) {
                return next(errors);
            }
        }
        if (school) {
            const result = shared_1.schoolDataSchema.safeParse(school);
            if (!result.success) {
                return next(result.error);
            }
        }
        if (role) {
            const { errors, success } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.roleDataSchema, role);
            if (!success) {
                return next(errors);
            }
        }
        const redisKey = `complete_profile:${userId}`;
        const existingDataStr = await redis_1.redisClient.get(redisKey);
        const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
        const newData = {
            ...existingData,
            ...req.body,
            savedAt: new Date().toISOString(),
            userId,
        };
        await redis_1.redisClient.setEx(redisKey, 60 * 60 * 24, JSON.stringify(newData));
        return res.status(200).json({
            ok: true,
            message: 'Progression sauvegardée',
            savedAt: newData.savedAt,
        });
    }
    catch (error) {
        console.error('Erreur sauvegarde progression:', error);
        return res
            .status(500)
            .json({ ok: false, error: 'Erreur lors de la sauvegarde' });
    }
});
exports.default = router;
//# sourceMappingURL=save-progress.route.js.map