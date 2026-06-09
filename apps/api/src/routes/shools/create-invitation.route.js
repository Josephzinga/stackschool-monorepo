"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const shared_1 = require("@stackschool/shared");
const invitation_service_1 = require("../../services/invitation.service");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const router = (0, express_1.Router)();
router.post('/invitations', auth_1.isAuthenticated, async (req, res, next) => {
    try {
        const errors = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createInvitationSchema, req.body);
        if (errors)
            return next(errors);
        const invitationData = req.body;
        const invitation = await (0, invitation_service_1.createAndSendInvitation)(invitationData);
        res.status(201).json({
            ok: true,
            message: 'Invitation envoyée avec succès.',
            invitation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=create-invitation.route.js.map