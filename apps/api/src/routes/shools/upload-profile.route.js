"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middlewares/auth");
const path_1 = __importDefault(require("path"));
const validate_profile_picture_1 = require("../../middlewares/validate-profile-picture");
const redis_1 = require("../../lib/redis");
const db_1 = require("@stackschool/db");
const router = (0, express_1.Router)();
const IMAGES_DIR = path_1.default.resolve(process.cwd(), 'public', 'images');
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const user = req.user;
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname) || '';
        const safeName = `${user?.id}-${unique}${ext}`;
        cb(null, safeName);
    },
});
const uploadProfile = (0, multer_1.default)({ storage: storage });
router.post('/profile-picture', auth_1.isAuthenticated, uploadProfile.single('profilePicture'), validate_profile_picture_1.validateUploadedImage, async (req, res) => {
    try {
        const isOnCompleteProfile = req.body.isOnCompleteProfile || false;
        const profileId = req.body.profileId;
        const user = req.user;
        if (!req.file)
            throw new Error('Pas de fichier après multer');
        const publicPath = `/images/${req.file.filename}`;
        if (isOnCompleteProfile) {
            const key = `pendingPhoto${user?.id}`;
            await redis_1.redisClient.set(key, publicPath);
            return res.status(200).json({
                ok: true,
                message: `Image sauvegardée temporairement.`,
                path: publicPath,
            });
        }
        console.log('user', user);
        const profile = await db_1.prisma.profile.update({
            where: {
                userId: user?.id,
            },
            data: {
                photo: publicPath,
            },
            select: {
                photo: true,
            },
        });
        return res.status(200).json({
            ok: true,
            message: 'Image sauvegardée avec succès.',
            path: profile?.photo,
        });
    }
    catch (err) {
        console.error('Upload error', err);
        return res
            .status(500)
            .json({ ok: false, error: 'Erreur pendant upload' });
    }
});
exports.default = router;
//# sourceMappingURL=upload-profile.route.js.map