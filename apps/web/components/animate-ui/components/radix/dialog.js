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
exports.Dialog = Dialog;
exports.DialogTrigger = DialogTrigger;
exports.DialogClose = DialogClose;
exports.DialogContent = DialogContent;
exports.DialogHeader = DialogHeader;
exports.DialogFooter = DialogFooter;
exports.DialogTitle = DialogTitle;
exports.DialogDescription = DialogDescription;
const React = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const dialog_1 = require("@/components/animate-ui/primitives/radix/dialog");
const utils_1 = require("@/lib/utils");
function Dialog(props) {
    return <dialog_1.Dialog {...props}/>;
}
function DialogTrigger(props) {
    return <dialog_1.DialogTrigger {...props}/>;
}
function DialogClose(props) {
    return <dialog_1.DialogClose {...props}/>;
}
function DialogOverlay({ className, ...props }) {
    return (<dialog_1.DialogOverlay className={(0, utils_1.cn)('fixed inset-0 z-50 bg-black/50', className)} {...props}/>);
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return (<dialog_1.DialogPortal>
      <DialogOverlay />
      <dialog_1.DialogContent className={(0, utils_1.cn)('bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg', className)} {...props}>
        {children}
        {showCloseButton && (<dialog_1.DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <lucide_react_1.XIcon />
            <span className="sr-only">Close</span>
          </dialog_1.DialogClose>)}
      </dialog_1.DialogContent>
    </dialog_1.DialogPortal>);
}
function DialogHeader({ className, ...props }) {
    return (<dialog_1.DialogHeader className={(0, utils_1.cn)('flex flex-col gap-2 text-center sm:text-left', className)} {...props}/>);
}
function DialogFooter({ className, ...props }) {
    return (<dialog_1.DialogFooter className={(0, utils_1.cn)('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props}/>);
}
function DialogTitle({ className, ...props }) {
    return (<dialog_1.DialogTitle className={(0, utils_1.cn)('text-lg leading-none font-semibold', className)} {...props}/>);
}
function DialogDescription({ className, ...props }) {
    return (<dialog_1.DialogDescription className={(0, utils_1.cn)('text-muted-foreground text-sm', className)} {...props}/>);
}
//# sourceMappingURL=dialog.js.map