"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_school_classes_route_1 = __importDefault(require("./get-school-classes.route"));
const search_school_route_1 = __importDefault(require("./search-school.route"));
const create_invitation_route_1 = __importDefault(require("./create-invitation.route"));
const search_school_student_route_1 = __importDefault(require("./search-school-student.route"));
const upload_profile_route_1 = __importDefault(require("./upload-profile.route"));
const router = (0, express_1.Router)();
router.use('/schools', get_school_classes_route_1.default);
router.use('/schools', search_school_route_1.default);
router.use('/schools', create_invitation_route_1.default);
router.use('/schools', search_school_student_route_1.default);
router.use('/schools', upload_profile_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map