"use client";
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
exports.Command = Command;
exports.CommandDialog = CommandDialog;
exports.CommandInput = CommandInput;
exports.CommandList = CommandList;
exports.CommandEmpty = CommandEmpty;
exports.CommandGroup = CommandGroup;
exports.CommandItem = CommandItem;
exports.CommandShortcut = CommandShortcut;
exports.CommandSeparator = CommandSeparator;
const React = __importStar(require("react"));
const cmdk_1 = require("cmdk");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const dialog_1 = require("@/components/ui/dialog");
function Command({ className, ...props }) {
    return (<cmdk_1.Command data-slot="command" className={(0, utils_1.cn)("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)} {...props}/>);
}
function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, className, showCloseButton = true, ...props }) {
    return (<dialog_1.Dialog {...props}>
      <dialog_1.DialogHeader className="sr-only">
        <dialog_1.DialogTitle>{title}</dialog_1.DialogTitle>
        <dialog_1.DialogDescription>{description}</dialog_1.DialogDescription>
      </dialog_1.DialogHeader>
      <dialog_1.DialogContent className={(0, utils_1.cn)("overflow-hidden p-0", className)} showCloseButton={showCloseButton}>
        <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
function CommandInput({ className, ...props }) {
    return (<div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
      <lucide_react_1.SearchIcon className="size-4 shrink-0 opacity-50"/>
      <cmdk_1.Command.Input data-slot="command-input" className={(0, utils_1.cn)("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}/>
    </div>);
}
function CommandList({ className, ...props }) {
    return (<cmdk_1.Command.List data-slot="command-list" className={(0, utils_1.cn)("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)} {...props}/>);
}
function CommandEmpty({ ...props }) {
    return (<cmdk_1.Command.Empty data-slot="command-empty" className="py-6 text-center text-sm" {...props}/>);
}
function CommandGroup({ className, ...props }) {
    return (<cmdk_1.Command.Group data-slot="command-group" className={(0, utils_1.cn)("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className)} {...props}/>);
}
function CommandSeparator({ className, ...props }) {
    return (<cmdk_1.Command.Separator data-slot="command-separator" className={(0, utils_1.cn)("-mx-1 h-px bg-border", className)} {...props}/>);
}
function CommandItem({ className, ...props }) {
    return (<cmdk_1.Command.Item data-slot="command-item" className={(0, utils_1.cn)("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", className)} {...props}/>);
}
function CommandShortcut({ className, ...props }) {
    return (<span data-slot="command-shortcut" className={(0, utils_1.cn)("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props}/>);
}
//# sourceMappingURL=command.js.map