"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Register;
const react_1 = __importDefault(require("react"));
const sign_up_form_1 = require("@/components/sign-up-form");
const react_native_keyboard_aware_scroll_view_1 = require("react-native-keyboard-aware-scroll-view");
function Register() {
    return (<react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" enableAutomaticScroll={true} enableOnAndroid={true} contentContainerClassName={'h-full w-full'} extraHeight={20}>
      <sign_up_form_1.SignUpForm />
    </react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView>);
}
//# sourceMappingURL=register.js.map