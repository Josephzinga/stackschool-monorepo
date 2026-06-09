"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const redis_1 = require("../../lib/redis");
const router = (0, express_1.Router)();
router.get('/load-progress', auth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        const redisKey = `complete_profile:${userId}`;
        const pathKey = `pendingPhoto${userId}`;
        const saveData = await redis_1.redisClient.get(redisKey);
        const picturePath = await redis_1.redisClient.get(pathKey);
        console.log('profilePath', picturePath);
        if (!saveData) {
            return res.status(400).json({
                ok: true,
                data: null,
                message: 'Aucune progression sauvegardée',
            });
        }
        const dataParsed = JSON.parse(saveData);
        if (dataParsed.userId !== userId) {
            await redis_1.redisClient.del(redisKey);
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'Données de progression invalides',
            });
        }
        const profileWithPhoto = { ...dataParsed.profile, photo: picturePath };
        console.log('ProfilePhoto', profileWithPhoto.photo);
        return res.status(200).json({
            ok: true,
            data: {
                school: dataParsed.school,
                profile: profileWithPhoto,
                role: dataParsed.role,
                currentStep: dataParsed.currentStep,
                savedAt: dataParsed.savedAt,
            },
        });
    }
    catch (error) {
        console.error('Erreur chargement progression:', error);
        return res.status(500).json({ error: 'Erreur lors du chargement' });
    }
});
exports.default = router;
//# sourceMappingURL=load-progress.route.js.map