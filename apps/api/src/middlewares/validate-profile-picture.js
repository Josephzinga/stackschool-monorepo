"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedImage = validateUploadedImage;
const upload_profile_picture_1 = require("../validations/upload-profile-picture");
const api_errors_1 = require("../utils/api-errors");
const validate_schema_util_1 = require("../utils/validate-schema.util");
function validateUploadedImage(req, res, next) {
    console.log('File', req?.file);
    if (!req.file) {
        return res
            .status(400)
            .json({ ok: false, message: 'Aucun fichier à uploadé' });
    }
    const { success, errors, data } = (0, validate_schema_util_1.safeValidateSchema)(upload_profile_picture_1.uploadedImageSchema, {
        file: req.file,
        body: req.body,
    });
    if (!success) {
        (0, api_errors_1.createServiceError)(errors?.[0]?.message || "Erreur de validation de l'image", 401, errors);
    }
    next();
}
//# sourceMappingURL=validate-profile-picture.js.map