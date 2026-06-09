"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeInput = void 0;
const input_1 = require("@/components/ui/input");
const react_1 = __importDefault(require("react"));
const TimeInput = ({ ...props }) => (<input_1.Input type="time" step="60" {...props} className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none h-9!"/>);
exports.TimeInput = TimeInput;
//# sourceMappingURL=time-input.js.map