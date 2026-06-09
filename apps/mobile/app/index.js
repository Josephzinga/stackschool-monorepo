"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const react_1 = __importDefault(require("react"));
const toggle_theme_1 = require("@/components/toggle-theme");
const shared_1 = require("@stackschool/shared");
function Home() {
    return (<react_native_1.View className="flex h-full w-full items-center justify-center">
      <react_native_1.Text className="font-inter-semibold text-xl text-card">Home page joseph</react_native_1.Text>
      <toggle_theme_1.ToggleTheme />
      <react_native_1.View className="p flex w-1/2 flex-col gap-4">
        <react_native_1.Pressable onPress={() => expo_router_1.router.push('/auth/login')}>
          <react_native_1.Text className="font-inter-semibold rounded-lg bg-slate-100 p-4 dark:bg-blue-700">
            Go to Login page
          </react_native_1.Text>
        </react_native_1.Pressable>
        <react_native_1.Pressable onPress={async () => {
            try {
                const me = await shared_1.api.post('/api/auth/forgot-password', {
                    identifier: '+22395248106',
                });
                console.log('Me', me.data);
            }
            catch (error) {
                console.log('Error', error);
            }
        }}>
          <react_native_1.Text className="font-inter-semibold rounded-lg bg-slate-100 p-4 dark:bg-blue-700">
            Get me
          </react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=index.js.map