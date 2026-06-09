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
exports.Popover = Popover;
exports.PopoverTrigger = PopoverTrigger;
exports.PopoverContent = PopoverContent;
exports.PopoverAnchor = PopoverAnchor;
const React = __importStar(require("react"));
const PopoverPrimitive = __importStar(require("@radix-ui/react-popover"));
const utils_1 = require("@/lib/utils");
function Popover({ ...props }) {
    return <PopoverPrimitive.Root data-slot="popover" {...props}/>;
}
function PopoverTrigger({ ...props }) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props}/>;
}
function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }) {
    return (<PopoverPrimitive.Portal>
      <PopoverPrimitive.Content data-slot="popover-content" align={align} sideOffset={sideOffset} className={(0, utils_1.cn)('bg-accent/40 backdrop-blur-2xl text-popover-foreground data-[state=open]:animate-in' +
            ' data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden', className)} {...props}/>
    </PopoverPrimitive.Portal>);
}
function PopoverAnchor({ ...props }) {
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props}/>;
}
//# sourceMappingURL=popover.js.map