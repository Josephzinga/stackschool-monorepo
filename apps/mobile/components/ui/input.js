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
exports.Input = void 0;
const utils_1 = require("@/lib/utils");
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const lucide_react_native_1 = require("lucide-react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const AnimatedTextInput = react_native_reanimated_1.default.createAnimatedComponent(react_native_1.TextInput);
const Input = (0, react_1.forwardRef)(({ className, Icon, RightIcon, isPassword, error, onBlur, onFocus, borderColor = '#E5E7EB', activeBorderColor = '#3B82F6', ...props }, ref) => {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const PasswordIcon = showPassword ? lucide_react_native_1.EyeOff : lucide_react_native_1.Eye;
    const FinalRightIcon = isPassword ? PasswordIcon : RightIcon;
    const focusProgress = (0, react_native_reanimated_1.useSharedValue)(0);
    const handlePress = () => {
        if (isPassword) {
            setShowPassword(!showPassword);
        }
    };
    const handleFocus = (e) => {
        focusProgress.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 200 });
        onFocus?.(e);
    };
    const handleBlur = (e) => {
        focusProgress.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 200 });
        onBlur?.(e);
    };
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const borderColorValue = (0, react_native_reanimated_1.interpolateColor)(focusProgress.value, [0, 1], [error ? '#EF4444' : borderColor, error ? '#EF4444' : activeBorderColor]);
        return {
            borderColor: borderColorValue,
            borderWidth: 1,
        };
    });
    return (<react_native_1.View className="relative w-full">
        {Icon && (<react_native_1.View className="absolute left-3 top-0 z-10 h-full justify-center">
            <Icon size={20} color={'gray'}/>
          </react_native_1.View>)}
        <AnimatedTextInput ref={ref} className={(0, utils_1.cn)('h-[50px] w-full rounded-2xl bg-white shadow-sm shadow-black/5 dark:placeholder:text-muted-foreground/50', Icon ? 'pl-12' : 'pl-4', FinalRightIcon ? 'pr-12' : 'pr-4', className)} style={animatedStyle} secureTextEntry={isPassword ? !showPassword : props.secureTextEntry} onBlur={handleBlur} onFocus={handleFocus} placeholderTextColor="#9CA3AF" {...props}/>
        {FinalRightIcon && (<react_native_1.View className="absolute right-3 top-0 z-10 h-full justify-center">
            {isPassword ? (<react_native_1.TouchableOpacity onPress={handlePress} className="h-full justify-center">
                <FinalRightIcon size={20} color={'gray'}/>
              </react_native_1.TouchableOpacity>) : (<FinalRightIcon size={20} color={'gray'}/>)}
          </react_native_1.View>)}
      </react_native_1.View>);
});
exports.Input = Input;
Input.displayName = 'Input';
//# sourceMappingURL=input.js.map