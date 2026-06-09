"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkField = checkField;
const api_1 = __importStar(require("@stackschool/shared/src/lib/api"));
async function checkField(field, value) {
    try {
        const response = await api_1.default.get(`/api/validate/user-field?`, {
            params: { [field]: value },
        });
        if (response.data) {
            return {
                status: response.status,
                valid: response.data.valid,
                message: response.data.message,
                field: response.data.field,
            };
        }
        return null;
    }
    catch (error) {
        const { message } = (0, api_1.parseAxiosError)(error);
        return {
            status: error.status,
            valid: false,
            message: message || 'Identifiant invalide',
            field: field,
        };
    }
}
//# sourceMappingURL=check-profile-field.js.map