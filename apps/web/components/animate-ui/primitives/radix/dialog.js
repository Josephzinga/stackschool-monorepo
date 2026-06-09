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
exports.useDialog = void 0;
exports.Dialog = Dialog;
exports.DialogPortal = DialogPortal;
exports.DialogOverlay = DialogOverlay;
exports.DialogClose = DialogClose;
exports.DialogTrigger = DialogTrigger;
exports.DialogContent = DialogContent;
exports.DialogHeader = DialogHeader;
exports.DialogFooter = DialogFooter;
exports.DialogTitle = DialogTitle;
exports.DialogDescription = DialogDescription;
const React = __importStar(require("react"));
const radix_ui_1 = require("radix-ui");
const react_1 = require("motion/react");
const use_controlled_state_1 = require("@/hooks/use-controlled-state");
const get_strict_context_1 = require("@/lib/get-strict-context");
const [DialogProvider, useDialog] = (0, get_strict_context_1.getStrictContext)('DialogContext');
exports.useDialog = useDialog;
function Dialog(props) {
    const [isOpen, setIsOpen] = (0, use_controlled_state_1.useControlledState)({
        value: props?.open,
        defaultValue: props?.defaultOpen,
        onChange: props?.onOpenChange,
    });
    return (<DialogProvider value={{ isOpen, setIsOpen }}>
      <radix_ui_1.Dialog.Root data-slot="dialog" {...props} onOpenChange={setIsOpen}/>
    </DialogProvider>);
}
function DialogTrigger(props) {
    return <radix_ui_1.Dialog.Trigger data-slot="dialog-trigger" {...props}/>;
}
function DialogPortal(props) {
    const { isOpen } = useDialog();
    return (<react_1.AnimatePresence>
      {isOpen && (<radix_ui_1.Dialog.Portal data-slot="dialog-portal" forceMount {...props}/>)}
    </react_1.AnimatePresence>);
}
function DialogOverlay({ transition = { duration: 0.2, ease: 'easeInOut' }, ...props }) {
    return (<radix_ui_1.Dialog.Overlay data-slot="dialog-overlay" asChild forceMount>
      <react_1.motion.div key="dialog-overlay" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={transition} {...props}/>
    </radix_ui_1.Dialog.Overlay>);
}
function DialogContent({ from = 'top', onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, transition = { type: 'spring', stiffness: 150, damping: 25 }, ...props }) {
    const initialRotation = from === 'bottom' || from === 'left' ? '20deg' : '-20deg';
    const isVertical = from === 'top' || from === 'bottom';
    const rotateAxis = isVertical ? 'rotateX' : 'rotateY';
    return (<radix_ui_1.Dialog.Content asChild forceMount onOpenAutoFocus={onOpenAutoFocus} onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onInteractOutside={onInteractOutside}>
      <react_1.motion.div key="dialog-content" data-slot="dialog-content" initial={{
            opacity: 0,
            filter: 'blur(4px)',
            transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
        }} animate={{
            opacity: 1,
            filter: 'blur(0px)',
            transform: `perspective(500px) ${rotateAxis}(0deg) scale(1)`,
        }} exit={{
            opacity: 0,
            filter: 'blur(4px)',
            transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
        }} transition={transition} {...props}/>
    </radix_ui_1.Dialog.Content>);
}
function DialogClose(props) {
    return <radix_ui_1.Dialog.Close data-slot="dialog-close" {...props}/>;
}
function DialogHeader(props) {
    return <div data-slot="dialog-header" {...props}/>;
}
function DialogFooter(props) {
    return <div data-slot="dialog-footer" {...props}/>;
}
function DialogTitle(props) {
    return <radix_ui_1.Dialog.Title data-slot="dialog-title" {...props}/>;
}
function DialogDescription(props) {
    return (<radix_ui_1.Dialog.Description data-slot="dialog-description" {...props}/>);
}
//# sourceMappingURL=dialog.js.map