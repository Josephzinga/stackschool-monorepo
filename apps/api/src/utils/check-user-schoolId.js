"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAndSchoolId = void 0;
const api_errors_1 = require("./api-errors");
const checkUserAndSchoolId = (user, schoolId) => {
    if (!user)
        throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
    if (!schoolId)
        throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant", 400);
};
exports.checkUserAndSchoolId = checkUserAndSchoolId;
//# sourceMappingURL=check-user-schoolId.js.map