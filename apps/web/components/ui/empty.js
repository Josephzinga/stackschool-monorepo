"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empty = Empty;
exports.EmptyHeader = EmptyHeader;
exports.EmptyTitle = EmptyTitle;
exports.EmptyDescription = EmptyDescription;
exports.EmptyContent = EmptyContent;
exports.EmptyMedia = EmptyMedia;
const class_variance_authority_1 = require("class-variance-authority");
const utils_1 = require("@/lib/utils");
function Empty({ className, ...props }) {
    return (<div data-slot="empty" className={(0, utils_1.cn)("flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12", className)} {...props}/>);
}
function EmptyHeader({ className, ...props }) {
    return (<div data-slot="empty-header" className={(0, utils_1.cn)("flex max-w-sm flex-col items-center gap-2 text-center", className)} {...props}/>);
}
const emptyMediaVariants = (0, class_variance_authority_1.cva)("flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-transparent",
            icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function EmptyMedia({ className, variant = "default", ...props }) {
    return (<div data-slot="empty-icon" data-variant={variant} className={(0, utils_1.cn)(emptyMediaVariants({ variant, className }))} {...props}/>);
}
function EmptyTitle({ className, ...props }) {
    return (<div data-slot="empty-title" className={(0, utils_1.cn)("text-lg font-medium tracking-tight", className)} {...props}/>);
}
function EmptyDescription({ className, ...props }) {
    return (<div data-slot="empty-description" className={(0, utils_1.cn)("text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4", className)} {...props}/>);
}
function EmptyContent({ className, ...props }) {
    return (<div data-slot="empty-content" className={(0, utils_1.cn)("flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance", className)} {...props}/>);
}
//# sourceMappingURL=empty.js.map