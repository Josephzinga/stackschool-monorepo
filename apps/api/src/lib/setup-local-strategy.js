"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupLocalStrategy;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_local_controller_1 = __importDefault(require("../controllers/passport-local.controller"));
function setupLocalStrategy() {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'identifier',
        passwordField: 'password',
        session: true,
    }, (identifier, password, done) => {
        return (0, passport_local_controller_1.default)(identifier, password, done);
    }));
}
//# sourceMappingURL=setup-local-strategy.js.map