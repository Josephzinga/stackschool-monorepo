"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const validation_schema_1 = require("../validations/validation-schema");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/user-field', auth_1.isAuthenticated, async (req, res) => {
    try {
        const user = req.user;
        const parseResult = validation_schema_1.validateUserFieldSchema.safeParse(req.query);
        if (!parseResult.success) {
            return res.status(400).json({
                ok: false,
                valid: false,
                message: parseResult.error.issues.map((issue) => issue.message),
            });
        }
        const { email, phoneNumber, selfCheck = true } = parseResult.data;
        if (selfCheck ? email && user?.email !== email : email) {
            const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.json({
                    ok: true,
                    valid: false,
                    field: 'email',
                    message: 'Cette valeur est déjà utilisée.',
                });
            }
        }
        if (selfCheck
            ? phoneNumber &&
                user?.phoneNumber?.replace(/\s+/g, '') !==
                    phoneNumber?.replace(/\s+/g, '')
            : phoneNumber) {
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: {
                    phoneNumber: phoneNumber?.replace(/\s+/g, ''),
                },
            });
            if (existingUser) {
                return res.json({
                    ok: true,
                    valid: false,
                    field: 'phone',
                    message: 'Cette valeur est déjà utilisée.',
                });
            }
        }
        return res.json({
            ok: true,
            valid: true,
        });
    }
    catch (err) {
        console.error('validate user field error:', err);
        return res.status(500).json({
            ok: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=validationField.route.js.map