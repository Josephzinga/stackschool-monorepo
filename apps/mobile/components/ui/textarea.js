"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textarea = Textarea;
const utils_1 = require("@/lib/utils");
const react_native_1 = require("react-native");
function Textarea({ className, multiline = true, numberOfLines = react_native_1.Platform.select({ web: 2, native: 8 }), placeholderClassName, ...props }) {
    return (<react_native_1.TextInput className={(0, utils_1.cn)('text-foreground border-input dark:bg-input/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 text-base shadow-sm shadow-black/5 md:text-sm', react_native_1.Platform.select({
            web: 'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }), props.editable === false && 'opacity-50', className)} placeholderClassName={(0, utils_1.cn)('text-muted-foreground', placeholderClassName)} multiline={multiline} numberOfLines={numberOfLines} textAlignVertical="top" {...props}/>);
}
//# sourceMappingURL=textarea.js.map