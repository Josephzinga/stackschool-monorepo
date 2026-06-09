"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const redis_1 = require("../../lib/redis");
const router = (0, express_1.Router)();
router.delete("/clear-progress", auth_1.isAuthenticated, async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const redisKey = `complete_profile:${userId}`;
        await redis_1.redisClient.del(redisKey);
        return res.status(200).json({
            success: true,
            message: "Progression nettoyée",
        });
    }
    catch (error) {
        console.error("Erreur nettoyage progression:", error);
        return res.status(500).json({ error: "Erreur lors du nettoyage" });
    }
});
exports.default = router;
//# sourceMappingURL=clear-progress.route.js.map