"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeleton = Skeleton;
const utils_1 = require("@/lib/utils");
const react_1 = __importDefault(require("react"));
function Skeleton({ className, ...props }) {
    return (<div data-slot="skeleton" className={(0, utils_1.cn)('bg-accent animate-pulse rounded-md', className)} {...props}/>);
}
//# sourceMappingURL=skeleton.js.map