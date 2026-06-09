"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonGroupVariants = void 0;
exports.ButtonGroup = ButtonGroup;
exports.ButtonGroupSeparator = ButtonGroupSeparator;
exports.ButtonGroupText = ButtonGroupText;
const class_variance_authority_1 = require("class-variance-authority");
const radix_ui_1 = require("radix-ui");
const react_1 = __importDefault(require("react"));
const utils_1 = require("@/lib/utils");
const separator_1 = require("@/components/ui/separator");
const buttonGroupVariants = (0, class_variance_authority_1.cva)("has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg flex w-fit items-stretch *:focus-visible:z-10 *:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1", {
    variants: {
        orientation: {
            horizontal: '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
            vertical: '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
    },
});
exports.buttonGroupVariants = buttonGroupVariants;
function ButtonGroup({ className, orientation, ...props }) {
    return (<div role="group" data-slot="button-group" data-orientation={orientation} className={(0, utils_1.cn)(buttonGroupVariants({ orientation }), className)} {...props}/>);
}
function ButtonGroupText({ className, asChild = false, ...props }) {
    const Comp = asChild ? radix_ui_1.Slot.Root : 'div';
    return (<Comp className={(0, utils_1.cn)("bg-muted gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none", className)} {...props}/>);
}
function ButtonGroupSeparator({ className, orientation = 'vertical', ...props }) {
    return (<separator_1.Separator data-slot="button-group-separator" orientation={orientation} className={(0, utils_1.cn)('bg-input relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto', className)} {...props}/>);
}
//# sourceMappingURL=button-group.js.map