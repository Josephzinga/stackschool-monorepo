"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logo;
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const utils_1 = require("@/lib/utils");
function Logo() {
    return (<react_native_1.View className="mt-10 flex w-full items-center justify-center">
      <react_native_1.Image source={require('./../assets/android-icon.png')} className={(0, utils_1.cn)('h-24 w-24')} resizeMode="contain" accessibilityLabel="Logo"/>

      <react_native_1.Text className="font-jost-bold text-2xl text-blue-900">Stackschool</react_native_1.Text>
    </react_native_1.View>);
}
//# sourceMappingURL=Logo.js.map