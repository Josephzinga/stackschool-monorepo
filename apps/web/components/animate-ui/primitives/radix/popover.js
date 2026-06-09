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
exports.usePopover = void 0;
exports.Popover = Popover;
exports.PopoverTrigger = PopoverTrigger;
exports.PopoverPortal = PopoverPortal;
exports.PopoverContent = PopoverContent;
exports.PopoverAnchor = PopoverAnchor;
exports.PopoverClose = PopoverClose;
exports.PopoverArrow = PopoverArrow;
const React = __importStar(require("react"));
const radix_ui_1 = require("radix-ui");
const react_1 = require("motion/react");
const get_strict_context_1 = require("@/lib/get-strict-context");
const use_controlled_state_1 = require("@/hooks/use-controlled-state");
const [PopoverProvider, usePopover] = (0, get_strict_context_1.getStrictContext)('PopoverContext');
exports.usePopover = usePopover;
function Popover(props) {
    const [isOpen, setIsOpen] = (0, use_controlled_state_1.useControlledState)({
        value: props?.open,
        defaultValue: props?.defaultOpen,
        onChange: props?.onOpenChange,
    });
    return (<PopoverProvider value={{ isOpen, setIsOpen }}>
      <radix_ui_1.Popover.Root data-slot="popover" {...props} onOpenChange={setIsOpen}/>
    </PopoverProvider>);
}
function PopoverTrigger(props) {
    return <radix_ui_1.Popover.Trigger data-slot="popover-trigger" {...props}/>;
}
function PopoverPortal(props) {
    const { isOpen } = usePopover();
    return (<react_1.AnimatePresence>
      {isOpen && (<radix_ui_1.Popover.Portal forceMount data-slot="popover-portal" {...props}/>)}
    </react_1.AnimatePresence>);
}
function PopoverContent({ onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, align, alignOffset, side, sideOffset, avoidCollisions, collisionBoundary, collisionPadding, arrowPadding, sticky, hideWhenDetached, transition = { type: 'spring', stiffness: 300, damping: 25 }, ...props }) {
    return (<radix_ui_1.Popover.Content asChild forceMount align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} avoidCollisions={avoidCollisions} collisionBoundary={collisionBoundary} collisionPadding={collisionPadding} arrowPadding={arrowPadding} sticky={sticky} hideWhenDetached={hideWhenDetached} onOpenAutoFocus={onOpenAutoFocus} onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onInteractOutside={onInteractOutside} onFocusOutside={onFocusOutside}>
      <react_1.motion.div key="popover-content" data-slot="popover-content" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={transition} {...props}/>
    </radix_ui_1.Popover.Content>);
}
function PopoverAnchor({ ...props }) {
    return <radix_ui_1.Popover.Anchor data-slot="popover-anchor" {...props}/>;
}
function PopoverArrow(props) {
    return <radix_ui_1.Popover.Arrow data-slot="popover-arrow" {...props}/>;
}
function PopoverClose(props) {
    return <radix_ui_1.Popover.Close data-slot="popover-close" {...props}/>;
}
//# sourceMappingURL=popover.js.map