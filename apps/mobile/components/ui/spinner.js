"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Spinner = ({ size = 'large', color = '#3B82F6', text, variant = 'default', }) => {
    const getContainerClass = () => {
        switch (variant) {
            case 'minimal':
                return 'p-2';
            case 'withBackground':
                return 'p-6 bg-gray-100 rounded-2xl shadow-md';
            default:
                return 'p-4';
        }
    };
    const getTextClass = () => {
        switch (variant) {
            case 'minimal':
                return 'text-sm text-gray-500 mt-1';
            case 'withBackground':
                return 'text-base font-semibold text-gray-800 mt-3';
            default:
                return 'text-base text-gray-700 mt-2';
        }
    };
    return (<react_native_1.View className={`items-center justify-center ${getContainerClass()}`}>
      <react_native_1.ActivityIndicator size={size} color={color}/>
      {text && <react_native_1.Text className={getTextClass()}>{text}</react_native_1.Text>}
    </react_native_1.View>);
};
exports.Spinner = Spinner;
exports.default = exports.Spinner;
//# sourceMappingURL=spinner.js.map