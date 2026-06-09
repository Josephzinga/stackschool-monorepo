"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_progress_route_1 = __importDefault(require("./load-progress.route"));
const save_progress_route_1 = __importDefault(require("./save-progress.route"));
const clear_progress_route_1 = __importDefault(require("./clear-progress.route"));
const verify_invitation_route_1 = __importDefault(require("./verify-invitation.route"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use('/', load_progress_route_1.default);
router.use('/', save_progress_route_1.default);
router.use('/', clear_progress_route_1.default);
router.use('/', verify_invitation_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map