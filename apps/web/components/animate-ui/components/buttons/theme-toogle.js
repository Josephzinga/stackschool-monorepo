'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeTogglerButton = ThemeTogglerButton;
const React = __importStar(require("react"));
const next_themes_1 = require("next-themes");
const lucide_react_1 = require("lucide-react");
const theme_toggler_1 = require("@/components/animate-ui/primitives/effects/theme-toggler");
const icon_1 = require("@/components/animate-ui/components/buttons/icon");
const utils_1 = require("@/lib/utils");
const getIcon = (effective, resolved, modes) => {
    const theme = modes.includes('system') ? effective : resolved;
    return theme === 'system' ? (<lucide_react_1.Monitor />) : theme === 'dark' ? (<lucide_react_1.Moon />) : (<lucide_react_1.Sun />);
};
const getNextTheme = (effective, modes) => {
    const i = modes.indexOf(effective);
    if (i === -1)
        return modes[0];
    return modes[(i + 1) % modes.length];
};
function ThemeTogglerButton({ variant = 'default', size = 'default', modes = ['light', 'dark', 'system'], direction = 'ltr', onImmediateChange, onClick, className, ...props }) {
    const { theme, resolvedTheme, setTheme } = (0, next_themes_1.useTheme)();
    return (<theme_toggler_1.ThemeToggler theme={theme} resolvedTheme={resolvedTheme} setTheme={setTheme} direction={direction} onImmediateChange={onImmediateChange}>
      {({ effective, resolved, toggleTheme }) => (<button data-slot="theme-toggler-button" className={(0, utils_1.cn)((0, icon_1.buttonVariants)({ variant, size, className }))} onClick={(e) => {
                onClick?.(e);
                toggleTheme(getNextTheme(effective, modes));
            }} {...props}>
          {getIcon(effective, resolved, modes)}
        </button>)}
    </theme_toggler_1.ThemeToggler>);
}
//# sourceMappingURL=theme-toogle.js.map