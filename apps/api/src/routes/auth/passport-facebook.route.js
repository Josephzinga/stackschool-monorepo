"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const deep_link_1 = require("../../utils/deep.link");
const social_web_controller_1 = require("../../controllers/social-web.controller");
const router = (0, express_1.Router)();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
router.get('/facebook', (req, res, next) => {
    const state = (0, deep_link_1.getPlateForm)(req);
    passport_1.default.authenticate('facebook', {
        scope: ['email', 'public_profile'],
        state,
    })(req, res, next);
});
router.get('/facebook/callback', passport_1.default.authenticate('facebook', {
    failureRedirect: `${FRONTEND_ORIGIN}/auth/login`,
    session: true,
}), async (req, res, next) => (0, social_web_controller_1.handleSocialWebCallback)(req, res, next, 'facebook'));
exports.default = router;
//# sourceMappingURL=passport-facebook.route.js.map