"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = __importDefault(require("react"));
const sign_in_form_1 = require("@/components/sign-in-form");
const react_native_keyboard_aware_scroll_view_1 = require("react-native-keyboard-aware-scroll-view");
const nativewind_1 = require("nativewind");
function Login() {
    const { colorScheme } = (0, nativewind_1.useColorScheme)();
    return (<react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" enableAutomaticScroll={true} enableOnAndroid={true} extraHeight={75} contentContainerClassName={'w-full h-full'}>
        <sign_in_form_1.SignInForm />
    </react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView>);
}
//# sourceMappingURL=login.js.map