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
exports.ScrollArea = ScrollArea;
exports.ScrollBar = ScrollBar;
const React = __importStar(require("react"));
const radix_ui_1 = require("radix-ui");
const utils_1 = require("@/lib/utils");
function ScrollArea({ className, children, ...props }) {
    return (<radix_ui_1.ScrollArea.Root data-slot="scroll-area" className={(0, utils_1.cn)('relative', className)} {...props}>
      <radix_ui_1.ScrollArea.Viewport data-slot="scroll-area-viewport" className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1">
        {children}
      </radix_ui_1.ScrollArea.Viewport>
      <ScrollBar />
      <radix_ui_1.ScrollArea.Corner />
    </radix_ui_1.ScrollArea.Root>);
}
function ScrollBar({ className, orientation = 'vertical', ...props }) {
    return (<radix_ui_1.ScrollArea.ScrollAreaScrollbar data-slot="scroll-area-scrollbar" data-orientation={orientation} orientation={orientation} className={(0, utils_1.cn)('data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent flex touch-none p-px transition-colors select-none', className)} {...props}>
      <radix_ui_1.ScrollArea.ScrollAreaThumb data-slot="scroll-area-thumb" className="rounded-full bg-border relative flex-1"/>
    </radix_ui_1.ScrollArea.ScrollAreaScrollbar>);
}
//# sourceMappingURL=scroll-area.js.map