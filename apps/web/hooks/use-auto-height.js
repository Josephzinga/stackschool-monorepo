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
exports.useAutoHeight = useAutoHeight;
const React = __importStar(require("react"));
function useAutoHeight(deps = [], options = {
    includeParentBox: true,
    includeSelfBox: false,
}) {
    const ref = React.useRef(null);
    const roRef = React.useRef(null);
    const [height, setHeight] = React.useState(0);
    const measure = React.useCallback(() => {
        const el = ref.current;
        if (!el)
            return 0;
        const base = el.getBoundingClientRect().height || 0;
        let extra = 0;
        if (options.includeParentBox && el.parentElement) {
            const cs = getComputedStyle(el.parentElement);
            const paddingY = (parseFloat(cs.paddingTop || '0') || 0) +
                (parseFloat(cs.paddingBottom || '0') || 0);
            const borderY = (parseFloat(cs.borderTopWidth || '0') || 0) +
                (parseFloat(cs.borderBottomWidth || '0') || 0);
            const isBorderBox = cs.boxSizing === 'border-box';
            if (isBorderBox) {
                extra += paddingY + borderY;
            }
        }
        if (options.includeSelfBox) {
            const cs = getComputedStyle(el);
            const paddingY = (parseFloat(cs.paddingTop || '0') || 0) +
                (parseFloat(cs.paddingBottom || '0') || 0);
            const borderY = (parseFloat(cs.borderTopWidth || '0') || 0) +
                (parseFloat(cs.borderBottomWidth || '0') || 0);
            const isBorderBox = cs.boxSizing === 'border-box';
            if (isBorderBox) {
                extra += paddingY + borderY;
            }
        }
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const total = Math.ceil((base + extra) * dpr) / dpr;
        return total;
    }, [options.includeParentBox, options.includeSelfBox]);
    React.useLayoutEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        setHeight(measure());
        if (roRef.current) {
            roRef.current.disconnect();
            roRef.current = null;
        }
        const ro = new ResizeObserver(() => {
            const next = measure();
            requestAnimationFrame(() => setHeight(next));
        });
        ro.observe(el);
        if (options.includeParentBox && el.parentElement) {
            ro.observe(el.parentElement);
        }
        roRef.current = ro;
        return () => {
            ro.disconnect();
            roRef.current = null;
        };
    }, deps);
    React.useLayoutEffect(() => {
        if (height === 0) {
            const next = measure();
            if (next !== 0)
                setHeight(next);
        }
    }, [height, measure]);
    return { ref, height };
}
//# sourceMappingURL=use-auto-height.js.map