"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtForUser = createJwtForUser;
exports.verifyJwtForUser = verifyJwtForUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../constant/config");
function createJwtForUser(user) {
    return jsonwebtoken_1.default.sign({ userId: user.id, email: user?.email }, config_1.JWT_SECRET);
}
function verifyJwtForUser(token) {
    return jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
}
//# sourceMappingURL=jwt.service.js.map