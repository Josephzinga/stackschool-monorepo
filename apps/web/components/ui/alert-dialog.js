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
exports.AlertDialog = AlertDialog;
exports.AlertDialogPortal = AlertDialogPortal;
exports.AlertDialogOverlay = AlertDialogOverlay;
exports.AlertDialogTrigger = AlertDialogTrigger;
exports.AlertDialogContent = AlertDialogContent;
exports.AlertDialogHeader = AlertDialogHeader;
exports.AlertDialogFooter = AlertDialogFooter;
exports.AlertDialogTitle = AlertDialogTitle;
exports.AlertDialogDescription = AlertDialogDescription;
exports.AlertDialogAction = AlertDialogAction;
exports.AlertDialogCancel = AlertDialogCancel;
const React = __importStar(require("react"));
const AlertDialogPrimitive = __importStar(require("@radix-ui/react-alert-dialog"));
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
function AlertDialog({ ...props }) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props}/>;
}
function AlertDialogTrigger({ ...props }) {
    return (<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props}/>);
}
function AlertDialogPortal({ ...props }) {
    return (<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props}/>);
}
function AlertDialogOverlay({ className, ...props }) {
    return (<AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay" className={(0, utils_1.cn)('data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50', className)} {...props}/>);
}
function AlertDialogContent({ className, ...props }) {
    return (<AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content data-slot="alert-dialog-content" className={(0, utils_1.cn)('bg-background/80 backdrop-blur-3xl data-[state=open]:animate-in data-[state=closed]:animate-out' +
            ' data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', className)} {...props}/>
    </AlertDialogPortal>);
}
function AlertDialogHeader({ className, ...props }) {
    return (<div data-slot="alert-dialog-header" className={(0, utils_1.cn)('flex flex-col gap-2 text-center sm:text-left', className)} {...props}/>);
}
function AlertDialogFooter({ className, ...props }) {
    return (<div data-slot="alert-dialog-footer" className={(0, utils_1.cn)('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props}/>);
}
function AlertDialogTitle({ className, ...props }) {
    return (<AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={(0, utils_1.cn)('text-lg font-semibold', className)} {...props}/>);
}
function AlertDialogDescription({ className, ...props }) {
    return (<AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={(0, utils_1.cn)('text-muted-foreground text-sm', className)} {...props}/>);
}
function AlertDialogAction({ className, variant = 'default', ...props }) {
    return (<AlertDialogPrimitive.Action className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant }), className)} {...props}/>);
}
function AlertDialogCancel({ className, ...props }) {
    return (<AlertDialogPrimitive.Cancel className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant: 'outline' }), className)} {...props}/>);
}
//# sourceMappingURL=alert-dialog.js.map