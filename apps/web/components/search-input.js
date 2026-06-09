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
exports.SearchInput = void 0;
const React = __importStar(require("react"));
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
const spinner_1 = require("./ui/spinner");
const SearchInput = React.forwardRef(({ className, value, onChange, onClear, isLoading = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value && String(value).length > 0;
    return (<div className={(0, utils_1.cn)('relative flex items-center w-full transition-transform duration-300 ease-in-out', isFocused ? 'scale-x-[1.025] scale-y-[1.05]' : 'scale-100', className)}>
        
        <div className={(0, utils_1.cn)('absolute left-4 transition-colors duration-300 z-10', isFocused ? 'text-primary' : 'text-muted-foreground')}>
          <lucide_react_1.Search className="h-6 w-6"/>
        </div>

        
        <input ref={ref} type="text" value={value} onChange={onChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className={(0, utils_1.cn)('h-14 w-full border placeholder:text-background rounded-full dark:shadow-gray-700/50 shadow-slate-300 shadow-sm! bg-linear-to-br from-blue-100/80 to-blue-200 dark:bg-linear-to-tl dark:from-gray-600 dark:to-gray-700 pl-14 pr-14 text-lg transition-all duration-300', 'placeholder:text-muted-foreground/60', 'focus:border-primary focus:outline-none', 'hover:border-primary/30 focus:shadow-primary focus:shadow-2xl', isLoading ? 'border-primary/50' : 'border-muted', className)} {...props}/>

        
        {isLoading && (<span className="absolute inset-0 rounded-full border-2 border-primary/30 "/>)}

        
        <div className="absolute right-4 z-10">
          {isLoading ? (<spinner_1.Spinner className="h-5 w-5 text-primary"/>) : (hasValue &&
            onClear && (<button type="button" onClick={onClear} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Effacer la recherche">
                <lucide_react_1.X className="h-5 w-5"/>
              </button>))}
        </div>
      </div>);
});
exports.SearchInput = SearchInput;
SearchInput.displayName = 'SearchInput';
//# sourceMappingURL=search-input.js.map