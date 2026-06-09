"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldError = void 0;
const utils_1 = require("@/lib/utils");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const FieldError = ({ children, className, }) => {
    return <react_native_1.Text className={(0, utils_1.cn)('text-xs text-red-500', className)}>{children}</react_native_1.Text>;
};
exports.FieldError = FieldError;
//# sourceMappingURL=field.js.map