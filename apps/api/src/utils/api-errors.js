"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceError = createServiceError;
const types_1 = require("@stackschool/shared/src/types");
function createServiceError(message, statusCode = 500, details) {
    return new types_1.ServiceError(message, statusCode, details);
}
//# sourceMappingURL=api-errors.js.map