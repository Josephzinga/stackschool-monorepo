"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const complete_profile_1 = __importDefault(require("./complete-profile"));
const profile_route_1 = __importDefault(require("./users/profile.route"));
const validationField_route_1 = __importDefault(require("./validationField.route"));
const upload_profile_route_1 = __importDefault(require("./shools/upload-profile.route"));
const shools_1 = __importDefault(require("./shools"));
const router = (0, express_1.Router)();
router.use('/', auth_1.default);
router.use('/complete-profile', complete_profile_1.default);
router.use('/', profile_route_1.default);
router.use('/validate', validationField_route_1.default);
router.use('/upload', upload_profile_route_1.default);
router.use('/', complete_profile_1.default);
router.use('/', shools_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map