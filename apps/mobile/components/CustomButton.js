"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomButton = CustomButton;
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const lucide_react_native_1 = require("lucide-react-native");
const spinner_1 = require("./ui/spinner");
const utils_1 = require("@/lib/utils");
function CustomButton({ children, onPress, className, isSubmitting, }) {
    return (<react_native_1.TouchableOpacity className={(0, utils_1.cn)("relative flex h-[50px] flex-row items-center justify-center gap-2 rounded-full bg-blue-700  pl-2 pr-1.5 text-white shadow-sm shadow-blue-700", className)} onPress={onPress} disabled={isSubmitting}>
      <react_native_1.Text className="font-jost-bold text-lg text-white">{children}</react_native_1.Text>
      <react_native_1.View className={'absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white'}>
        {isSubmitting ? <spinner_1.Spinner size="small"/> : <lucide_react_native_1.ArrowRight size={20} color="#1d4ed8"/>}
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
}
//# sourceMappingURL=CustomButton.js.map