"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthLayout;
const expo_router_1 = require("expo-router");
const react_1 = __importDefault(require("react"));
const theme_1 = require("@/lib/theme");
const native_1 = require("@react-navigation/native");
const nativewind_1 = require("nativewind");
function AuthLayout() {
    const { colorScheme } = (0, nativewind_1.useColorScheme)();
    return (<native_1.ThemeProvider value={theme_1.NAV_THEME[colorScheme ?? 'light']}>
      <expo_router_1.Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
        <expo_router_1.Stack.Screen name="login" options={{ title: 'Login' }}/>
        <expo_router_1.Stack.Screen name="register" options={{ title: 'Register' }}/>
        <expo_router_1.Stack.Screen name="forgot-password" options={{ title: 'Forgot password' }}/>
        <expo_router_1.Stack.Screen name="finish" options={{ title: 'Finish' }}/>
        <expo_router_1.Stack.Screen name="verify-code" options={{ title: 'Verify code' }}/>
        <expo_router_1.Stack.Screen name="reset-password" options={{ title: 'Reset password' }}/>
      </expo_router_1.Stack>
    </native_1.ThemeProvider>);
}
//# sourceMappingURL=_layout.js.map