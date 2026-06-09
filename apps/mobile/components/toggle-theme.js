"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleTheme = ToggleTheme;
const nativewind_1 = require("nativewind");
const react_native_1 = require("react-native");
const lucide_react_native_1 = require("lucide-react-native");
const react_1 = __importDefault(require("react"));
const utils_1 = require("@/lib/utils");
function ToggleTheme() {
    const { colorScheme, setColorScheme } = (0, nativewind_1.useColorScheme)();
    return (<react_native_1.View className={(0, utils_1.cn)('flex h-8 w-8 items-center justify-center rounded-lg border-2 border-border ')}>
      <react_native_1.TouchableOpacity onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
        {colorScheme === 'dark' ? (<lucide_react_native_1.Moon size={20} color="white"/>) : (<lucide_react_native_1.Sun color="black" size={20}/>)}
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
//# sourceMappingURL=toggle-theme.js.map