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
exports.default = ForgotPassword;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const ui_1 = require("@stackschool/ui");
const ui_2 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
function ForgotPassword() {
    const router = (0, expo_router_1.useRouter)();
    const [phoneValue, setPhoneValue] = (0, react_1.useState)("");
    const { control, handleSubmit, setValue, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({
        resolver: (0, ui_2.zodResolver)(shared_1.forgotPasswordSchema),
        mode: "onBlur",
    });
    const detectInputType = (value) => {
        if (value.includes("@") && value.includes("."))
            return "email";
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value))
            return "phone";
        return "any";
    };
    const handleIdentifierChange = (value) => {
        const type = detectInputType(value);
        if (type === "phone")
            setPhoneValue(value);
        setValue("identifier", value);
    };
    const onSubmit = async (data) => {
        let identifier = data.identifier;
        if (detectInputType(identifier) === "phone" && phoneValue)
            identifier = phoneValue;
        try {
            const res = await fetch(`/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });
            const json = await res.json();
            if (json?.ok) {
                react_native_1.Alert.alert("Succès", json.message || "Code envoyé");
                const tempToken = json.tempToken;
                if (tempToken)
                    router.push(`/auth/verify-code?token=${tempToken}`);
                return;
            }
            react_native_1.Alert.alert("Erreur", json?.message || "Erreur réseau");
        }
        catch (err) {
            react_native_1.Alert.alert("Erreur", err?.message || "Erreur réseau");
        }
    };
    return (<react_native_1.View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <react_native_1.View className="w-full max-w-md">
        <react_native_1.Text className="text-2xl font-bold text-center mb-4">
          Récupération de mot de passe
        </react_native_1.Text>

        <ui_1.Controller control={control} name="identifier" render={({ field: { onChange, onBlur, value } }) => (<react_native_1.View className="mb-4">
              <react_native_1.Text className="mb-1 text-sm">
                Identifiant (email, téléphone ou nom d'utilisateur)
              </react_native_1.Text>
              <react_native_1.TextInput value={value} onChangeText={(v) => {
                onChange(v);
                handleIdentifierChange(v);
            }} onBlur={onBlur} placeholder="example@gmail.com ou +223 77 00 00 00" className="border px-3 py-2 rounded-md"/>
              {errors.identifier && (<react_native_1.Text className="text-red-500 text-sm mt-1">
                  {String(errors.identifier?.message)}
                </react_native_1.Text>)}
            </react_native_1.View>)}/>

        <react_native_1.TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-emerald-600 py-3 rounded-md items-center">
          {isSubmitting ? (<react_native_1.ActivityIndicator color="#fff"/>) : (<react_native_1.Text className="text-white font-semibold">Recevoir le code</react_native_1.Text>)}
        </react_native_1.TouchableOpacity>

        <react_native_1.TouchableOpacity onPress={() => router.push("/auth/login")} className="mt-4 items-center">
          <react_native_1.Text className="text-sm text-sky-600">← Retour à la connexion</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=forgot-password.js.map