"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBackgroundImage = void 0;
const next_themes_1 = require("next-themes");
const image_1 = __importDefault(require("next/image"));
const ToggleBackgroundImage = () => {
    const { theme } = (0, next_themes_1.useTheme)();
    return (<div>
      <image_1.default src={`/bg-${theme}.jpg`} alt="" width={1000} height={1000} className="absolute inset-0 w-full h-screen mask-r-from-80% -z-30"/>
    </div>);
};
exports.ToggleBackgroundImage = ToggleBackgroundImage;
//# sourceMappingURL=LightModeBackgound.js.map