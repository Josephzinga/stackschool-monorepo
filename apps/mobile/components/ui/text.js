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
exports.TextClassContext = void 0;
exports.Text = Text;
const utils_1 = require("@/lib/utils");
const Slot = __importStar(require("@rn-primitives/slot"));
const class_variance_authority_1 = require("class-variance-authority");
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const textVariants = (0, class_variance_authority_1.cva)((0, utils_1.cn)('text-foreground text-base', react_native_1.Platform.select({
    web: 'select-text',
})), {
    variants: {
        variant: {
            default: '',
            h1: (0, utils_1.cn)('text-center text-4xl font-extrabold tracking-tight', react_native_1.Platform.select({ web: 'scroll-m-20 text-balance' })),
            h2: (0, utils_1.cn)('border-border border-b pb-2 text-3xl font-semibold tracking-tight', react_native_1.Platform.select({ web: 'scroll-m-20 first:mt-0' })),
            h3: (0, utils_1.cn)('text-2xl font-semibold tracking-tight', react_native_1.Platform.select({ web: 'scroll-m-20' })),
            h4: (0, utils_1.cn)('text-xl font-semibold tracking-tight', react_native_1.Platform.select({ web: 'scroll-m-20' })),
            p: 'mt-3 leading-7 sm:mt-6',
            blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
            code: (0, utils_1.cn)('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'),
            lead: 'text-muted-foreground text-xl',
            large: 'text-lg font-semibold',
            small: 'text-sm font-medium leading-none',
            muted: 'text-muted-foreground text-sm',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
const ROLE = {
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    blockquote: react_native_1.Platform.select({ web: 'blockquote' }),
    code: react_native_1.Platform.select({ web: 'code' }),
};
const ARIA_LEVEL = {
    h1: '1',
    h2: '2',
    h3: '3',
    h4: '4',
};
const TextClassContext = React.createContext(undefined);
exports.TextClassContext = TextClassContext;
function Text({ className, asChild = false, variant = 'default', ...props }) {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : react_native_1.Text;
    return (<Component className={(0, utils_1.cn)(textVariants({ variant }), textClass, className)} role={variant ? ROLE[variant] : undefined} aria-level={variant ? ARIA_LEVEL[variant] : undefined} {...props}/>);
}
//# sourceMappingURL=text.js.map