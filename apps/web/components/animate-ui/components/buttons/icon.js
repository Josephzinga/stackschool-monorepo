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
exports.buttonVariants = void 0;
exports.IconButton = IconButton;
const React = __importStar(require("react"));
const class_variance_authority_1 = require("class-variance-authority");
const button_1 = require("@/components/animate-ui/primitives/buttons/button");
const utils_1 = require("@/lib/utils");
const particles_1 = require("@/components/animate-ui/primitives/effects/particles");
const buttonVariants = (0, class_variance_authority_1.cva)("flex items-center justify-center rounded-md transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
            accent: 'bg-accent text-accent-foreground shadow-xs hover:bg-accent/90',
            destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
            default: 'size-9',
            xs: "size-7 [&_svg:not([class*='size-'])]:size-3.5 rounded-md",
            sm: 'size-8 rounded-md',
            lg: 'size-10 rounded-md',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonVariants = buttonVariants;
function IconButton({ className, onClick, variant, size, children, ...props }) {
    const [isActive, setIsActive] = React.useState(false);
    const [key, setKey] = React.useState(0);
    return (<particles_1.Particles asChild animate={isActive} key={key}>
      <button_1.Button data-slot="icon-button" className={(0, utils_1.cn)(buttonVariants({ variant, size, className }))} onClick={(e) => {
            setKey((prev) => prev + 1);
            setIsActive(true);
            onClick?.(e);
        }} {...props}>
        {children}
        <particles_1.ParticlesEffect data-variant={variant} className="bg-neutral-500 size-1 rounded-full"/>
      </button_1.Button>
    </particles_1.Particles>);
}
//# sourceMappingURL=icon.js.map