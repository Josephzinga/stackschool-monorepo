"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialSections = void 0;
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const google_button_1 = __importDefault(require("./google-button"));
const facebook_button_1 = __importDefault(require("./facebook-button"));
const SocialSections = () => (<react_native_1.View className="flex flex-row justify-center gap-6 w-full ">
    <google_button_1.default />
    <facebook_button_1.default />
  </react_native_1.View>);
exports.SocialSections = SocialSections;
//# sourceMappingURL=social-section.js.map