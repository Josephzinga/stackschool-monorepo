"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const shared_1 = require("@stackschool/shared");
const redis_1 = require("../../lib/redis");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const router = (0, express_1.Router)();
router.put('/profile', auth_1.isAuthenticated, async (req, res, next) => {
    try {
        const user = req.user;
        const userId = user?.id;
        const errors = (0, validate_schema_util_1.safeValidateSchema)(shared_1.profileSchema, req.body);
        if (errors)
            return next(errors);
        const redisKey = `complete_profile:${userId}`;
        const existingData = await redis_1.redisClient.get(redisKey);
        const profileData = existingData
            ? JSON.parse(existingData).profile
            : req.body;
        await redis_1.redisClient.setEx(redisKey, 24 * 60 * 600, JSON.stringify(profileData));
        return res.json({
            ok: true,
            message: 'Profil sauvegardé temporairement',
            profile: profileData,
        });
    }
    catch (error) {
        if (error instanceof shared_1.ZodError) {
            return res.status(400).json({
                ok: false,
                message: 'Données invalides',
                errors: error.message,
            });
        }
        console.error('Erreur sauvegarde profil:', error);
        return res.status(500).json({
            ok: false,
            message: 'Erreur lors de la sauvegarde du profil',
        });
    }
});
exports.default = router;
//# sourceMappingURL=profile.route.js.map