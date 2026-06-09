"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.hashToken = hashToken;
exports.generate6Code = generate6Code;
exports.hashCode = hashCode;
const crypto_1 = __importDefault(require("crypto"));
function generateToken(len = 32) {
    return crypto_1.default.randomBytes(len).toString('hex');
}
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
function generate6Code() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashCode(code) {
    return hashToken(code);
}
//# sourceMappingURL=outils.js.map