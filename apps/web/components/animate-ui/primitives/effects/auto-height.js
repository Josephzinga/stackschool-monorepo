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
exports.AutoHeight = AutoHeight;
const React = __importStar(require("react"));
const react_1 = require("motion/react");
const use_auto_height_1 = require("@/hooks/use-auto-height");
const slot_1 = require("@/components/animate-ui/primitives/animate/slot");
function AutoHeight({ children, deps = [], transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    bounce: 0,
    restDelta: 0.01,
}, style, animate, asChild = false, ...props }) {
    const { ref, height } = (0, use_auto_height_1.useAutoHeight)(deps);
    const Comp = asChild ? slot_1.Slot : react_1.motion.div;
    return (<Comp style={{ overflow: 'hidden', ...style }} animate={{ height, ...animate }} transition={transition} {...props}>
      <div ref={ref}>{children}</div>
    </Comp>);
}
//# sourceMappingURL=auto-height.js.map