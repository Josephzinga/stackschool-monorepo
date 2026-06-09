"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const social_web_controller_1 = require("../../controllers/social-web.controller");
const router = (0, express_1.Router)();
router.get('/google', (req, res, next) => {
    passport_1.default.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/auth/login',
    session: true,
}), (req, res, next) => (0, social_web_controller_1.handleSocialWebCallback)(req, res, next, 'google'));
exports.default = router;
//# sourceMappingURL=passport-google.route.js.map