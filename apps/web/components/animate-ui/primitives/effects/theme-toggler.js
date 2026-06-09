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
exports.ThemeToggler = ThemeToggler;
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
function getSystemEffective() {
    if (typeof window === 'undefined')
        return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}
function getClipKeyframes(direction) {
    switch (direction) {
        case 'ltr':
            return ['inset(0 100% 0 0)', 'inset(0 0 0 0)'];
        case 'rtl':
            return ['inset(0 0 0 100%)', 'inset(0 0 0 0)'];
        case 'ttb':
            return ['inset(0 0 100% 0)', 'inset(0 0 0 0)'];
        case 'btt':
            return ['inset(100% 0 0 0)', 'inset(0 0 0 0)'];
        default:
            return ['inset(0 100% 0 0)', 'inset(0 0 0 0)'];
    }
}
function ThemeToggler({ theme, resolvedTheme, setTheme, onImmediateChange, direction = 'ltr', children, ...props }) {
    const [preview, setPreview] = React.useState(null);
    const [current, setCurrent] = React.useState({
        effective: theme,
        resolved: resolvedTheme,
    });
    React.useEffect(() => {
        if (preview &&
            theme === preview.effective &&
            resolvedTheme === preview.resolved) {
            setPreview(null);
        }
    }, [theme, resolvedTheme, preview]);
    const [fromClip, toClip] = getClipKeyframes(direction);
    const toggleTheme = React.useCallback(async (theme) => {
        const resolved = theme === 'system' ? getSystemEffective() : theme;
        setCurrent({ effective: theme, resolved });
        onImmediateChange?.(theme);
        if (theme === 'system' && resolved === resolvedTheme) {
            setTheme(theme);
            return;
        }
        if (!document.startViewTransition) {
            (0, react_dom_1.flushSync)(() => {
                setPreview({ effective: theme, resolved });
            });
            setTheme(theme);
            return;
        }
        await document.startViewTransition(() => {
            (0, react_dom_1.flushSync)(() => {
                setPreview({ effective: theme, resolved });
                document.documentElement.classList.toggle('dark', resolved === 'dark');
            });
        }).ready;
        document.documentElement
            .animate({ clipPath: [fromClip, toClip] }, {
            duration: 700,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
        })
            .finished.finally(() => {
            setTheme(theme);
        });
    }, [onImmediateChange, resolvedTheme, fromClip, toClip, setTheme]);
    return (<React.Fragment {...props}>
      {typeof children === 'function'
            ? children({
                effective: current.effective,
                resolved: current.resolved,
                toggleTheme,
            })
            : children}
      <style>{`::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}`}</style>
    </React.Fragment>);
}
//# sourceMappingURL=theme-toggler.js.map