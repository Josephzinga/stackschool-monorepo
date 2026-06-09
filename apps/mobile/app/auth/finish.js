"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Finish;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
function Finish() {
    const router = (0, expo_router_1.useRouter)();
    return (<react_native_1.View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <react_native_1.View className="w-full max-w-md items-center">
        <react_native_1.Text className="text-3xl font-bold text-center mb-4">
          Inscription terminée
        </react_native_1.Text>
        <react_native_1.Text className="text-center mb-6">
          Votre compte a été créé. Veuillez vérifier votre boîte mail ou
          terminer votre profil.
        </react_native_1.Text>

        <react_native_1.TouchableOpacity onPress={() => router.push("/auth/login")} className="bg-emerald-600 py-3 rounded-md w-full items-center">
          <react_native_1.Text className="text-white font-semibold">Aller à la connexion</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=finish.js.map