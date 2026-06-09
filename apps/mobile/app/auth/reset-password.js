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
exports.default = ResetPassword;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const ui_1 = require("@stackschool/ui");
const ui_2 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
function ResetPassword() {
    const params = (0, expo_router_1.useLocalSearchParams)();
    const router = (0, expo_router_1.useRouter)();
    const token = params?.token;
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    const { control, handleSubmit, watch, formState: { errors, isSubmitting, isValid }, } = (0, ui_1.useForm)({
        resolver: (0, ui_2.zodResolver)(shared_1.resetPasswordSchema),
        mode: "onChange",
    });
    const passwordValue = watch("password");
    const getPasswordStrength = (password) => {
        if (!password)
            return 0;
        let strength = 0;
        if (password.length >= 8)
            strength++;
        if (/[a-z]/.test(password))
            strength++;
        if (/[A-Z]/.test(password))
            strength++;
        if (/\d/.test(password))
            strength++;
        if (/[^a-zA-Z0-9]/.test(password))
            strength++;
        return strength;
    };
    const onSubmit = async (data) => {
        if (!token) {
            react_native_1.Alert.alert("Erreur", "Token manquant");
            return;
        }
        try {
            const res = await fetch("/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password }),
            });
            const json = await res.json();
            if (json?.ok) {
                react_native_1.Alert.alert("Succès", json.message || "Mot de passe réinitialisé");
                setTimeout(() => router.push("/auth/login"), 1500);
                return;
            }
            react_native_1.Alert.alert("Erreur", json?.message || "Erreur lors de la réinitialisation");
        }
        catch (err) {
            react_native_1.Alert.alert("Erreur", err?.message || "Erreur réseau");
        }
    };
    if (!token) {
        return (<react_native_1.View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
        <react_native_1.View className="w-full max-w-md">
          <react_native_1.Text className="text-2xl font-bold text-center mb-4">
            Lien invalide
          </react_native_1.Text>
          <react_native_1.Text className="text-center mb-4">
            Le lien de réinitialisation est invalide ou a expiré.
          </react_native_1.Text>
          <react_native_1.TouchableOpacity className="bg-emerald-600 py-3 rounded-md items-center" onPress={() => router.push("/auth/forgot-password")}>
            <react_native_1.Text className="text-white">Demander un nouveau lien</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>);
    }
    const strength = getPasswordStrength(passwordValue || "");
    return (<react_native_1.View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <react_native_1.View className="w-full max-w-md">
        <react_native_1.Text className="text-2xl font-bold text-center mb-4">
          Nouveau mot de passe
        </react_native_1.Text>

        <ui_1.Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (<react_native_1.View className="mb-3">
              <react_native_1.Text className="mb-1 text-sm">Nouveau mot de passe</react_native_1.Text>
              <react_native_1.TextInput secureTextEntry={!showPassword} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Votre nouveau mot de passe" className="border px-3 py-2 rounded-md"/>
              {errors.password && (<react_native_1.Text className="text-red-500 text-sm mt-1">
                  {String(errors.password?.message)}
                </react_native_1.Text>)}
            </react_native_1.View>)}/>

        {passwordValue ? (<react_native_1.View className="mb-3">
            <react_native_1.View className="flex-row gap-1">
              {[1, 2, 3, 4, 5].map((l) => (<react_native_1.View key={l} className={`h-1 flex-1 rounded ${l <= strength
                    ? l <= 2
                        ? "bg-red-500"
                        : l === 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    : "bg-gray-200"}`}/>))}
            </react_native_1.View>
            <react_native_1.Text className="text-xs text-gray-600">
              {strength <= 2 ? "Faible" : strength === 3 ? "Moyen" : "Fort"}
            </react_native_1.Text>
          </react_native_1.View>) : null}

        <ui_1.Controller control={control} name="confirm" render={({ field: { onChange, onBlur, value } }) => (<react_native_1.View className="mb-4">
              <react_native_1.Text className="mb-1 text-sm">Confirmer le mot de passe</react_native_1.Text>
              <react_native_1.TextInput secureTextEntry={!showConfirm} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Confirmez votre mot de passe" className="border px-3 py-2 rounded-md"/>
              {errors.confirm && (<react_native_1.Text className="text-red-500 text-sm mt-1">
                  {String(errors.confirm?.message)}
                </react_native_1.Text>)}
            </react_native_1.View>)}/>

        <react_native_1.TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid} className="bg-emerald-600 py-3 rounded-md items-center">
          {isSubmitting ? (<react_native_1.ActivityIndicator color="#fff"/>) : (<react_native_1.Text className="text-white font-semibold">
              Réinitialiser le mot de passe
            </react_native_1.Text>)}
        </react_native_1.TouchableOpacity>

        <react_native_1.TouchableOpacity onPress={() => router.push("/auth/login")} className="mt-4 items-center">
          <react_native_1.Text className="text-sm text-sky-600">← Retour à la connexion</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=reset-password.js.map