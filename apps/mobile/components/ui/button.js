"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonVariants = exports.buttonTextVariants = void 0;
exports.Button = Button;
const text_1 = require("@/components/ui/text");
const utils_1 = require("@/lib/utils");
const class_variance_authority_1 = require("class-variance-authority");
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const buttonVariants = (0, class_variance_authority_1.cva)((0, utils_1.cn)('group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none', react_native_1.Platform.select({
    web: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
})), {
    variants: {
        variant: {
            default: (0, utils_1.cn)('bg-primary shadow-sm shadow-black/5 active:bg-primary/90', react_native_1.Platform.select({ web: 'hover:bg-primary/90' })),
            destructive: (0, utils_1.cn)('bg-destructive shadow-sm shadow-black/5 active:bg-destructive/90 dark:bg-destructive/60', react_native_1.Platform.select({
                web: 'hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
            })),
            outline: (0, utils_1.cn)('border border-border bg-background shadow-sm shadow-black/5 active:bg-accent dark:border-input dark:bg-input/30 dark:active:bg-input/50', react_native_1.Platform.select({
                web: 'hover:bg-accent dark:hover:bg-input/50',
            })),
            secondary: (0, utils_1.cn)('bg-secondary shadow-sm shadow-black/5 active:bg-secondary/80', react_native_1.Platform.select({ web: 'hover:bg-secondary/80' })),
            ghost: (0, utils_1.cn)('active:bg-accent dark:active:bg-accent/50', react_native_1.Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })),
            link: '',
        },
        size: {
            default: (0, utils_1.cn)('h-10 px-4 py-2 sm:h-9', react_native_1.Platform.select({ web: 'has-[>svg]:px-3' })),
            sm: (0, utils_1.cn)('h-9 gap-1.5 rounded-md px-3 sm:h-8', react_native_1.Platform.select({ web: 'has-[>svg]:px-2.5' })),
            lg: (0, utils_1.cn)('h-11 rounded-md px-6 sm:h-10', react_native_1.Platform.select({ web: 'has-[>svg]:px-4' })),
            icon: 'h-10 w-10 sm:h-9 sm:w-9',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonVariants = buttonVariants;
const buttonTextVariants = (0, class_variance_authority_1.cva)((0, utils_1.cn)('text-sm font-medium text-foreground', react_native_1.Platform.select({ web: 'pointer-events-none transition-colors' })), {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            destructive: 'text-white',
            outline: (0, utils_1.cn)('group-active:text-accent-foreground', react_native_1.Platform.select({ web: 'group-hover:text-accent-foreground' })),
            secondary: 'text-secondary-foreground',
            ghost: 'group-active:text-accent-foreground',
            link: (0, utils_1.cn)('text-primary group-active:underline', react_native_1.Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })),
        },
        size: {
            default: '',
            sm: '',
            lg: '',
            icon: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonTextVariants = buttonTextVariants;
function Button({ className, variant, size, ...props }) {
    return (<text_1.TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <react_native_1.Pressable className={(0, utils_1.cn)(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)} role="button" {...props}/>
    </text_1.TextClassContext.Provider>);
}
//# sourceMappingURL=button.js.map