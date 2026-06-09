"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res
        .status(401)
        .json({
        ok: false,
        message: "Utilisateur non authentifié veillez vous connécter",
    });
}
//# sourceMappingURL=auth.js.map