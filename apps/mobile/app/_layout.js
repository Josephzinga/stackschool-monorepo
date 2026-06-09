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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
const expo_router_1 = require("expo-router");
const react_1 = __importStar(require("react"));
require("./globals.css");
const native_1 = require("@react-navigation/native");
const nativewind_1 = require("nativewind");
const portal_1 = require("@rn-primitives/portal");
const shared_1 = require("@stackschool/shared");
const react_native_toast_message_1 = __importDefault(require("react-native-toast-message"));
const expo_font_1 = require("expo-font");
const SplashScreen = __importStar(require("expo-splash-screen"));
const Fonts_1 = require("@/lib/Fonts");
const theme_1 = require("@/lib/theme");
SplashScreen.preventAutoHideAsync();
const IP_ADDRESS = '192.168.1.12';
const API_PORT = 4000;
const API_URL = `http://${IP_ADDRESS}:${API_PORT}`;
function RootLayout() {
    const [loaded, error] = (0, expo_font_1.useFonts)(Fonts_1.declareFonts);
    const { colorScheme } = (0, nativewind_1.useColorScheme)();
    (0, react_1.useEffect)(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);
    (0, react_1.useEffect)(() => {
        shared_1.authServices.setBaseUrl(`http://localhost:${API_PORT}`);
        console.log(shared_1.authServices.getApiBaseUrl());
    }, [IP_ADDRESS, API_PORT]);
    if (!loaded && !error) {
        return null;
    }
    return (<native_1.ThemeProvider value={theme_1.NAV_THEME[colorScheme ?? 'light']}>
      <expo_router_1.Stack>
        <expo_router_1.Stack.Screen name="index" options={{ title: 'Home' }}/>
        <expo_router_1.Stack.Screen name="auth" options={{ headerShown: false }}/>
      </expo_router_1.Stack>
      <react_native_toast_message_1.default />
      <portal_1.PortalHost />
    </native_1.ThemeProvider>);
}
//# sourceMappingURL=_layout.js.map