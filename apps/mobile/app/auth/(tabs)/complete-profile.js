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
exports.default = CompleteProfile;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
function CompleteProfile() {
    const router = (0, expo_router_1.useRouter)();
    const [step, setStep] = (0, react_1.useState)(1);
    const steps = ['École', 'Profil', 'Rôle'];
    return (<react_native_1.View className="flex-1 items-center justify-center bg-white px-6 dark:bg-slate-800">
      <react_native_1.View className="w-full max-w-md">
        <react_native_1.Text className="mb-4 text-center text-2xl font-bold">Compléter le profil</react_native_1.Text>
        <react_native_1.Text className="mb-4 text-center">
          Étape {step} / {steps.length} — {steps[step - 1]}
        </react_native_1.Text>

        <react_native_1.View className="mb-4">
          <react_native_1.Text className="text-center">
            (Interface mobile en cours — réimplémenter les formulaires spécifiques selon rôle)
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View className="flex-row justify-between">
          <react_native_1.TouchableOpacity disabled={step === 1} onPress={() => setStep(Math.max(1, step - 1))} className="rounded-md border px-4 py-2">
            <react_native_1.Text>Précédent</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity onPress={() => {
            if (step < steps.length)
                setStep(step + 1);
            else
                router.push('/auth/login');
        }} className="rounded-md bg-emerald-600 px-4 py-2">
            <react_native_1.Text className="text-white">{step < steps.length ? 'Suivant' : 'Terminer'}</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=complete-profile.js.map