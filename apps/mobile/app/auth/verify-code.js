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
exports.default = VerifyCode;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const ui_1 = require("@stackschool/ui");
const ui_2 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
function VerifyCode() {
    const router = (0, expo_router_1.useRouter)();
    const params = (0, expo_router_1.useLocalSearchParams)();
    const tempToken = params?.token;
    const [countdown, setCountdown] = (0, react_1.useState)(0);
    const { control, handleSubmit, formState: { isSubmitting, errors }, } = (0, ui_1.useForm)({
        resolver: (0, ui_2.zodResolver)(shared_1.VerifyCodeSchema),
        mode: "onBlur",
    });
    (0, react_1.useEffect)(() => {
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [countdown]);
    const onSubmit = async ({ code }) => {
        try {
            const res = await fetch("/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, tempToken }),
            });
            const json = await res.json();
            if (json?.resetToken) {
                react_native_1.Alert.alert("Succès", json.message || "Code vérifié");
                router.push(`/auth/reset-password?token=${json.resetToken}`);
                return;
            }
            react_native_1.Alert.alert("Erreur", json?.message || "Code invalide");
        }
        catch (err) {
            react_native_1.Alert.alert("Erreur", err?.message || "Erreur réseau");
        }
    };
    const handleResend = async () => {
        try {
            const res = await fetch("/auth/resend-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tempToken }),
            });
            const json = await res.json();
            if (json?.ok) {
                react_native_1.Alert.alert("Succès", json.message || "Nouveau code envoyé");
                setCountdown(60);
                return;
            }
            react_native_1.Alert.alert("Erreur", json?.message || "Erreur lors de l'envoi");
        }
        catch (err) {
            react_native_1.Alert.alert("Erreur", err?.message || "Erreur réseau");
        }
    };
    return (<react_native_1.View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <react_native_1.View className="w-full max-w-md">
        <react_native_1.Text className="text-2xl font-bold text-center mb-4">
          Vérification du code
        </react_native_1.Text>
        <react_native_1.Text className="text-center text-sm text-gray-500 mb-4">
          Entrez le code à 6 chiffres envoyé
        </react_native_1.Text>

        <ui_1.Controller control={control} name="code" render={({ field: { onChange, onBlur, value } }) => (<react_native_1.View className="mb-4">
              <react_native_1.TextInput id="code" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="numeric" maxLength={6} placeholder="000000" className="border px-3 py-2 rounded-md text-center text-lg"/>
              {errors.code && (<react_native_1.Text className="text-red-500 text-sm mt-1">
                  {String(errors.code?.message)}
                </react_native_1.Text>)}
            </react_native_1.View>)}/>

        <react_native_1.TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-emerald-600 py-3 rounded-md items-center">
          {isSubmitting ? (<react_native_1.ActivityIndicator color="#fff"/>) : (<react_native_1.Text className="text-white font-semibold">Vérifier le code</react_native_1.Text>)}
        </react_native_1.TouchableOpacity>

        <react_native_1.View className="mt-4 items-center">
          {countdown > 0 ? (<react_native_1.Text className="text-sm text-gray-600">
              Nouveau code dans{" "}
              <react_native_1.Text className="text-emerald-400">{countdown}</react_native_1.Text> s
            </react_native_1.Text>) : (<react_native_1.TouchableOpacity onPress={handleResend}>
              <react_native_1.Text className="text-sm text-sky-600">Renvoyer le code</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>

        <react_native_1.TouchableOpacity onPress={() => router.push("/auth/login")} className="mt-6 items-center">
          <react_native_1.Text className="text-sm text-sky-600">← Retour à la connexion</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=verify-code.js.map