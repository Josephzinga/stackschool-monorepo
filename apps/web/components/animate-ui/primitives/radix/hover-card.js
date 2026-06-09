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
exports.useHoverCard = void 0;
exports.HoverCard = HoverCard;
exports.HoverCardTrigger = HoverCardTrigger;
exports.HoverCardPortal = HoverCardPortal;
exports.HoverCardContent = HoverCardContent;
exports.HoverCardArrow = HoverCardArrow;
const React = __importStar(require("react"));
const radix_ui_1 = require("radix-ui");
const react_1 = require("motion/react");
const get_strict_context_1 = require("@/lib/get-strict-context");
const use_controlled_state_1 = require("@/hooks/use-controlled-state");
const [HoverCardProvider, useHoverCard] = (0, get_strict_context_1.getStrictContext)('HoverCardContext');
exports.useHoverCard = useHoverCard;
function HoverCard({ followCursor = false, followCursorSpringOptions = { stiffness: 200, damping: 17 }, ...props }) {
    const [isOpen, setIsOpen] = (0, use_controlled_state_1.useControlledState)({
        value: props?.open,
        defaultValue: props?.defaultOpen,
        onChange: props?.onOpenChange,
    });
    const x = (0, react_1.useMotionValue)(0);
    const y = (0, react_1.useMotionValue)(0);
    return (<HoverCardProvider value={{
            isOpen,
            setIsOpen,
            x,
            y,
            followCursor,
            followCursorSpringOptions,
        }}>
      <radix_ui_1.HoverCard.Root data-slot="hover-card" {...props} onOpenChange={setIsOpen}/>
    </HoverCardProvider>);
}
function HoverCardTrigger({ onMouseMove, ...props }) {
    const { x, y, followCursor } = useHoverCard();
    const handleMouseMove = (event) => {
        onMouseMove?.(event);
        const target = event.currentTarget.getBoundingClientRect();
        if (followCursor === 'x' || followCursor === true) {
            const eventOffsetX = event.clientX - target.left;
            const offsetXFromCenter = (eventOffsetX - target.width / 2) / 2;
            x.set(offsetXFromCenter);
        }
        if (followCursor === 'y' || followCursor === true) {
            const eventOffsetY = event.clientY - target.top;
            const offsetYFromCenter = (eventOffsetY - target.height / 2) / 2;
            y.set(offsetYFromCenter);
        }
    };
    return (<radix_ui_1.HoverCard.Trigger data-slot="hover-card-trigger" onMouseMove={handleMouseMove} {...props}/>);
}
function HoverCardPortal(props) {
    const { isOpen } = useHoverCard();
    return (<react_1.AnimatePresence>
      {isOpen && (<radix_ui_1.HoverCard.Portal forceMount data-slot="hover-card-portal" {...props}/>)}
    </react_1.AnimatePresence>);
}
function HoverCardContent({ align, alignOffset, side, sideOffset, avoidCollisions, collisionBoundary, collisionPadding, arrowPadding, sticky, hideWhenDetached, style, transition = { type: 'spring', stiffness: 300, damping: 25 }, ...props }) {
    const { x, y, followCursor, followCursorSpringOptions } = useHoverCard();
    const translateX = (0, react_1.useSpring)(x, followCursorSpringOptions);
    const translateY = (0, react_1.useSpring)(y, followCursorSpringOptions);
    return (<radix_ui_1.HoverCard.Content asChild forceMount align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} avoidCollisions={avoidCollisions} collisionBoundary={collisionBoundary} collisionPadding={collisionPadding} arrowPadding={arrowPadding} sticky={sticky} hideWhenDetached={hideWhenDetached}>
      <react_1.motion.div key="hover-card-content" data-slot="hover-card-content" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={transition} style={{
            x: followCursor === 'x' || followCursor === true
                ? translateX
                : undefined,
            y: followCursor === 'y' || followCursor === true
                ? translateY
                : undefined,
            ...style,
        }} {...props}/>
    </radix_ui_1.HoverCard.Content>);
}
function HoverCardArrow(props) {
    return <radix_ui_1.HoverCard.Arrow data-slot="hover-card-arrow" {...props}/>;
}
//# sourceMappingURL=hover-card.js.map