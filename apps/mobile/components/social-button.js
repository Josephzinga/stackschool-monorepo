"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialButton = SocialButton;
const nativewind_1 = require("nativewind");
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const utils_1 = require("@/lib/utils");
function SocialButton({ strategy, onPress, className }) {
    const { colorScheme } = (0, nativewind_1.useColorScheme)();
    return (<react_native_1.TouchableOpacity style={{ width: '50%' }} className="flex h-[50px] flex-row justify-center gap-3  border border-border rounded-full items-center bg-card shadow-sm " onPress={onPress}>
        <react_native_1.Image className={(0, utils_1.cn)('size-4', className)} tintColor={strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined} resizeMode="contain" source={strategy.source}/>

        <react_native_1.Text className="font-jost-semibold font-semibold text-blue-700">{strategy.provider}</react_native_1.Text>
      </react_native_1.TouchableOpacity>);
}
//# sourceMappingURL=social-button.js.map