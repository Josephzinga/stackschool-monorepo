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
exports.Field = Field;
exports.FieldLabel = FieldLabel;
exports.FieldDescription = FieldDescription;
exports.FieldError = FieldError;
exports.FieldGroup = FieldGroup;
exports.FieldLegend = FieldLegend;
exports.FieldSeparator = FieldSeparator;
exports.FieldSet = FieldSet;
exports.FieldContent = FieldContent;
exports.FieldTitle = FieldTitle;
const react_1 = __importStar(require("react"));
const class_variance_authority_1 = require("class-variance-authority");
const utils_1 = require("@/lib/utils");
const label_1 = require("@/components/ui/label");
const separator_1 = require("@/components/ui/separator");
function FieldSet({ className, ...props }) {
    return (<fieldset data-slot="field-set" className={(0, utils_1.cn)('flex flex-col gap-6', 'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3', className)} {...props}/>);
}
function FieldLegend({ className, variant = 'legend', ...props }) {
    return (<legend data-slot="field-legend" data-variant={variant} className={(0, utils_1.cn)('mb-3 font-medium', 'data-[variant=legend]:text-base', 'data-[variant=label]:text-sm', className)} {...props}/>);
}
function FieldGroup({ className, ...props }) {
    return (<div data-slot="field-group" className={(0, utils_1.cn)('group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4', className)} {...props}/>);
}
const fieldVariants = (0, class_variance_authority_1.cva)('group/field flex w-full gap-3 data-[invalid=true]:text-destructive', {
    variants: {
        orientation: {
            vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
            horizontal: [
                'flex-row items-center',
                '[&>[data-slot=field-label]]:flex-auto',
                'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            ],
            responsive: [
                'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto',
                '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
                '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            ],
        },
    },
    defaultVariants: {
        orientation: 'vertical',
    },
});
function Field({ className, orientation = 'vertical', ...props }) {
    return (<div role="group" data-slot="field" data-orientation={orientation} className={(0, utils_1.cn)(fieldVariants({ orientation }), className, 'gap-1.5 md:gap-2')} {...props}/>);
}
function FieldContent({ className, ...props }) {
    return (<div data-slot="field-content" className={(0, utils_1.cn)('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)} {...props}/>);
}
function FieldLabel({ className, ...props }) {
    return (<label_1.Label data-slot="field-label" className={(0, utils_1.cn)('font-sans', 'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4', 'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10', className)} {...props}/>);
}
function FieldTitle({ className, ...props }) {
    return (<div data-slot="field-label" className={(0, utils_1.cn)('flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50', className)} {...props}/>);
}
function FieldDescription({ className, ...props }) {
    return (<p data-slot="field-description" className={(0, utils_1.cn)('text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance', 'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5', '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4', className)} {...props}/>);
}
function FieldSeparator({ children, className, ...props }) {
    return (<div data-slot="field-separator" data-content={!!children} className={(0, utils_1.cn)('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', className)} {...props}>
      <separator_1.Separator className="absolute inset-0 top-1/2"/>
      {children && (<span className="bg-background text-muted-foreground relative mx-auto block w-fit px-2" data-slot="field-separator-content">
          {children}
        </span>)}
    </div>);
}
function FieldError({ className, children, errors, ...props }) {
    const content = (0, react_1.useMemo)(() => {
        if (children) {
            return children;
        }
        if (!errors?.length) {
            return null;
        }
        const uniqueErrors = [
            ...new Map(errors.map((error) => [error?.message, error])).values(),
        ];
        if (uniqueErrors?.length == 1) {
            return uniqueErrors[0]?.message;
        }
        return (<ul className="ml-4 flex list-disc flex-col gap-1 text-xs">
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>);
    }, [children, errors]);
    if (!content) {
        return null;
    }
    return (<div role="alert" data-slot="field-error" className={(0, utils_1.cn)('text-destructive text-xs -mt-1.5 font-normal', className)} {...props}>
      {content}
    </div>);
}
//# sourceMappingURL=field.js.map