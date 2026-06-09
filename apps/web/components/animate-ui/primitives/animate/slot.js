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
exports.Slot = Slot;
const React = __importStar(require("react"));
const react_1 = require("motion/react");
const utils_1 = require("@/lib/utils");
function mergeRefs(...refs) {
    return (node) => {
        refs.forEach((ref) => {
            if (!ref)
                return;
            if (typeof ref === 'function') {
                ref(node);
            }
            else {
                ref.current = node;
            }
        });
    };
}
function mergeProps(childProps, slotProps) {
    const merged = { ...childProps, ...slotProps };
    if (childProps.className || slotProps.className) {
        merged.className = (0, utils_1.cn)(childProps.className, slotProps.className);
    }
    if (childProps.style || slotProps.style) {
        merged.style = {
            ...childProps.style,
            ...slotProps.style,
        };
    }
    return merged;
}
function Slot({ children, ref, ...props }) {
    const isAlreadyMotion = typeof children.type === 'object' &&
        children.type !== null &&
        (0, react_1.isMotionComponent)(children.type);
    const Base = React.useMemo(() => isAlreadyMotion
        ? children.type
        : react_1.motion.create(children.type), [isAlreadyMotion, children.type]);
    if (!React.isValidElement(children))
        return null;
    const { ref: childRef, ...childProps } = children.props;
    const mergedProps = mergeProps(childProps, props);
    return (<Base {...mergedProps} ref={mergeRefs(childRef, ref)}/>);
}
//# sourceMappingURL=slot.js.map