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
exports.Combobox = void 0;
exports.ComboboxInput = ComboboxInput;
exports.ComboboxContent = ComboboxContent;
exports.ComboboxList = ComboboxList;
exports.ComboboxItem = ComboboxItem;
exports.ComboboxGroup = ComboboxGroup;
exports.ComboboxLabel = ComboboxLabel;
exports.ComboboxCollection = ComboboxCollection;
exports.ComboboxEmpty = ComboboxEmpty;
exports.ComboboxSeparator = ComboboxSeparator;
exports.ComboboxChips = ComboboxChips;
exports.ComboboxChip = ComboboxChip;
exports.ComboboxChipsInput = ComboboxChipsInput;
exports.ComboboxTrigger = ComboboxTrigger;
exports.ComboboxValue = ComboboxValue;
exports.useComboboxAnchor = useComboboxAnchor;
const React = __importStar(require("react"));
const react_1 = require("@base-ui/react");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const input_group_1 = require("@/components/ui/input-group");
const Combobox = react_1.Combobox.Root;
exports.Combobox = Combobox;
function ComboboxValue({ ...props }) {
    return <react_1.Combobox.Value data-slot="combobox-value" {...props}/>;
}
function ComboboxTrigger({ className, children, ...props }) {
    return (<react_1.Combobox.Trigger data-slot="combobox-trigger" className={(0, utils_1.cn)("[&_svg:not([class*='size-'])]:size-4", className)} {...props}>
      {children}
      <lucide_react_1.ChevronDownIcon data-slot="combobox-trigger-icon" className="pointer-events-none size-4 text-muted-foreground"/>
    </react_1.Combobox.Trigger>);
}
function ComboboxClear({ className, ...props }) {
    return (<react_1.Combobox.Clear data-slot="combobox-clear" onClick={props.onClick} render={<input_group_1.InputGroupButton variant="ghost" size="icon-xs"/>} className={(0, utils_1.cn)(className)} {...props}>
      <lucide_react_1.XIcon className="pointer-events-none"/>
    </react_1.Combobox.Clear>);
}
function ComboboxInput({ className, children, disabled = false, showTrigger = true, showClear = false, onClear, ...props }) {
    return (<input_group_1.InputGroup className={(0, utils_1.cn)('w-auto', className)}>
      <react_1.Combobox.Input render={<input_group_1.InputGroupInput disabled={disabled}/>} {...props}/>
      <input_group_1.InputGroupAddon align="inline-end">
        {showTrigger && (<input_group_1.InputGroupButton size="icon-xs" variant="ghost" asChild data-slot="input-group-button" className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent" disabled={disabled}>
            <ComboboxTrigger />
          </input_group_1.InputGroupButton>)}
        {showClear && (<ComboboxClear onClick={() => onClear} disabled={disabled}/>)}
      </input_group_1.InputGroupAddon>
      {children}
    </input_group_1.InputGroup>);
}
function ComboboxContent({ className, side = 'bottom', sideOffset = 6, align = 'start', alignOffset = 0, anchor, ...props }) {
    return (<react_1.Combobox.Portal>
      <react_1.Combobox.Positioner side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} anchor={anchor} className="isolate z-50">
        <react_1.Combobox.Popup data-slot="combobox-content" data-chips={!!anchor} className={(0, utils_1.cn)('group/combobox-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95', className)} {...props}/>
      </react_1.Combobox.Positioner>
    </react_1.Combobox.Portal>);
}
function ComboboxList({ className, ...props }) {
    return (<react_1.Combobox.List data-slot="combobox-list" className={(0, utils_1.cn)('max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0', className)} {...props}/>);
}
function ComboboxItem({ className, children, ...props }) {
    return (<react_1.Combobox.Item data-slot="combobox-item" className={(0, utils_1.cn)("relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props}>
      {children}
      <react_1.Combobox.ItemIndicator data-slot="combobox-item-indicator" render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"/>}>
        <lucide_react_1.CheckIcon className="pointer-events-none size-4 pointer-coarse:size-5"/>
      </react_1.Combobox.ItemIndicator>
    </react_1.Combobox.Item>);
}
function ComboboxGroup({ className, ...props }) {
    return (<react_1.Combobox.Group data-slot="combobox-group" className={(0, utils_1.cn)(className)} {...props}/>);
}
function ComboboxLabel({ className, ...props }) {
    return (<react_1.Combobox.GroupLabel data-slot="combobox-label" className={(0, utils_1.cn)('px-2 py-1.5 text-xs text-muted-foreground pointer-coarse:px-3 pointer-coarse:py-2 pointer-coarse:text-sm', className)} {...props}/>);
}
function ComboboxCollection({ ...props }) {
    return (<react_1.Combobox.Collection data-slot="combobox-collection" {...props}/>);
}
function ComboboxEmpty({ className, ...props }) {
    return (<react_1.Combobox.Empty data-slot="combobox-empty" className={(0, utils_1.cn)('hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex', className)} {...props}/>);
}
function ComboboxSeparator({ className, ...props }) {
    return (<react_1.Combobox.Separator data-slot="combobox-separator" className={(0, utils_1.cn)('-mx-1 my-1 h-px bg-border', className)} {...props}/>);
}
function ComboboxChips({ className, ...props }) {
    return (<react_1.Combobox.Chips data-slot="combobox-chips" className={(0, utils_1.cn)('flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40', className)} {...props}/>);
}
function ComboboxChip({ className, children, showRemove = true, ...props }) {
    return (<react_1.Combobox.Chip data-slot="combobox-chip" className={(0, utils_1.cn)('flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0', className)} {...props}>
      {children}
      {showRemove && (<react_1.Combobox.ChipRemove render={<button_1.Button variant="ghost" size="icon-xs"/>} className="-ml-1 opacity-50 hover:opacity-100" data-slot="combobox-chip-remove">
          <lucide_react_1.XIcon className="pointer-events-none"/>
        </react_1.Combobox.ChipRemove>)}
    </react_1.Combobox.Chip>);
}
function ComboboxChipsInput({ className, children, ...props }) {
    return (<react_1.Combobox.Input data-slot="combobox-chip-input" className={(0, utils_1.cn)('min-w-16 flex-1 outline-none', className)} {...props}/>);
}
function useComboboxAnchor() {
    return React.useRef(null);
}
//# sourceMappingURL=combobox.js.map