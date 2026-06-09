"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forgot_password_route_1 = require("../../routes/auth/forgot-password.route");
const router = (0, express_1.Router)();
router.post('/forgot-password', (req, res, next) => (0, forgot_password_route_1.forgotPasswordRoute)(req, res, next));
exports.default = router;
//# sourceMappingURL=forgot-password.controller.js.map