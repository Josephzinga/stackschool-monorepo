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
exports.Input = Input;
const React = __importStar(require("react"));
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
function Input({ className, icon: Icon, isPassword, type, ...props }) {
    const [showPwd, setShowPwd] = React.useState(true);
    return (<div className="relative w-full">
      {Icon && (<span className="absolute  left-3 top-1/2 -translate-y-1/2 ">
          <Icon className="h-5 w-5 text-gray-400"/>
        </span>)}
      <input type={isPassword ? (showPwd ? 'password' : 'text') : type} data-slot="input" placeholder={isPassword ? '********' : undefined} className={(0, utils_1.cn)('lg:h-10', 'file:text-foreground border border-input placeholder:text-muted-foreground placeholder:font-mono' +
            ' placeholder:text-xs', ' placeholder:opacity-80 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-10 w-full min-w-0 rounded-lg bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', Icon ? 'pl-10' : 'pl-4', className)} {...props}/>
      {isPassword && (<button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" aria-label={showPwd ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}>
          {showPwd ? (<lucide_react_1.EyeOff className="w-5 h-5"/>) : (<lucide_react_1.Eye className="w-5 h-5"/>)}
        </button>)}
    </div>);
}
//# sourceMappingURL=input.js.map