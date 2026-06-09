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
exports.Particles = Particles;
exports.ParticlesEffect = ParticlesEffect;
const React = __importStar(require("react"));
const react_1 = require("motion/react");
const slot_1 = require("@/components/animate-ui/primitives/animate/slot");
const use_is_in_view_1 = require("@/hooks/use-is-in-view");
const get_strict_context_1 = require("@/lib/get-strict-context");
const [ParticlesProvider, useParticles] = (0, get_strict_context_1.getStrictContext)('ParticlesContext');
function Particles({ ref, animate = true, asChild = false, inView = false, inViewMargin = '0px', inViewOnce = true, children, style, ...props }) {
    const { ref: localRef, isInView } = (0, use_is_in_view_1.useIsInView)(ref, { inView, inViewOnce, inViewMargin });
    const Component = asChild ? slot_1.Slot : react_1.motion.div;
    return (<ParticlesProvider value={{ animate, isInView }}>
      <Component ref={localRef} style={{ position: 'relative', ...style }} {...props}>
        {children}
      </Component>
    </ParticlesProvider>);
}
function ParticlesEffect({ side = 'top', align = 'center', count = 6, radius = 30, spread = 360, duration = 0.8, holdDelay = 0.05, sideOffset = 0, alignOffset = 0, delay = 0, transition, style, ...props }) {
    const { animate, isInView } = useParticles();
    const isVertical = side === 'top' || side === 'bottom';
    const alignPct = align === 'start' ? '0%' : align === 'end' ? '100%' : '50%';
    const top = isVertical
        ? side === 'top'
            ? `calc(0% - ${sideOffset}px)`
            : `calc(100% + ${sideOffset}px)`
        : `calc(${alignPct} + ${alignOffset}px)`;
    const left = isVertical
        ? `calc(${alignPct} + ${alignOffset}px)`
        : side === 'left'
            ? `calc(0% - ${sideOffset}px)`
            : `calc(100% + ${sideOffset}px)`;
    const containerStyle = {
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -50%)',
    };
    const angleStep = (spread * (Math.PI / 180)) / Math.max(1, count - 1);
    return (<react_1.AnimatePresence>
      {animate &&
            isInView &&
            [...Array(count)].map((_, i) => {
                const angle = i * angleStep;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (<react_1.motion.div key={i} style={{ ...containerStyle, ...style }} initial={{ scale: 0, opacity: 0 }} animate={{
                        x: `${x}px`,
                        y: `${y}px`,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                    }} transition={{
                        duration,
                        delay: delay + i * holdDelay,
                        ease: 'easeOut',
                        ...transition,
                    }} {...props}/>);
            })}
    </react_1.AnimatePresence>);
}
//# sourceMappingURL=particles.js.map