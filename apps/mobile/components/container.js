"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const utils_1 = require("@/lib/utils");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Container = ({ children, className, }) => (<react_native_1.View className={(0, utils_1.cn)('flex min-h-screen w-full max-w-sm items-center justify-center gap-4 bg-slate-900', className)}>
    {children}
  </react_native_1.View>);
exports.Container = Container;
//# sourceMappingURL=container.js.map