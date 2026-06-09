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
exports.SignInForm = SignInForm;
const ui_1 = require("@stackschool/ui");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const text_1 = require("@/components/ui/text");
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const shared_1 = require("@stackschool/shared");
const react_native_toast_message_1 = __importDefault(require("react-native-toast-message"));
const field_1 = require("./field");
const lucide_react_native_1 = require("lucide-react-native");
const social_section_1 = require("./social-section");
const Logo_1 = __importDefault(require("./Logo"));
const CustomButton_1 = require("@/components/CustomButton");
function SignInForm() {
    const { handleSubmit, control, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({ resolver: (0, ui_1.zodResolver)(shared_1.loginFormSchema), mode: 'onBlur' });
    const router = (0, expo_router_1.useRouter)();
    const passwordInputRef = React.useRef(null);
    const [showPassword, setShowPassword] = React.useState(false);
    function onEmailSubmitEditing() {
        console.log('onEmailSubmitEditing');
        passwordInputRef.current?.focus();
    }
    async function onSubmit(data) {
        console.log('unsubmit');
        try {
            const res = await shared_1.authServices.login(data);
            console.log('response ok', res);
            if (res.ok) {
                react_native_toast_message_1.default.show({
                    type: 'success',
                    text1: res.message,
                });
                if (res.complteProfile) {
                    router.push('/auth/complete-profile');
                }
            }
        }
        catch (err) {
            const { data, message, status } = (0, shared_1.parseAxiosError)(err);
            react_native_toast_message_1.default.show({
                type: 'error',
                text1: message || 'Erreur réseau',
            });
        }
    }
    return (<card_1.Card className="h-full bg-slate-50 py-4 dark:bg-blue-900">
      <card_1.CardHeader>
        <Logo_1.default />
        <card_1.CardTitle className="text-card! font-inter-bold text-center text-xl sm:text-left">
          Bienvenue
        </card_1.CardTitle>
        <card_1.CardDescription className="text-center sm:text-left">
          Accédez à votre espace scolaire pour communiquer, suivre et gérer les informations en
          temps réel.
        </card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent className=" gap-4">
        <react_native_1.View className="gap-3 ">
          <react_native_1.View className="gap-1.5">
            <label_1.Label htmlFor="email">Email ou nom d'utilisateur</label_1.Label>
            <ui_1.Controller name="identifier" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input error={!!errors.identifier} Icon={lucide_react_native_1.Mail} id="identifier" placeholder="m@example.com" keyboardType="email-address" autoComplete="email" autoCapitalize="none" onSubmitEditing={onEmailSubmitEditing} returnKeyType="next" onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>
            {errors.identifier && <field_1.FieldError>{errors.identifier?.message}</field_1.FieldError>}
          </react_native_1.View>
          <react_native_1.View className="gap-1.5">
            <react_native_1.View className="flex-row items-center">
              <label_1.Label htmlFor="password">Mot de passe</label_1.Label>
              <button_1.Button variant="link" size="sm" className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4" onPress={() => {
            router.push('/auth/forgot-password');
        }}>
                <text_1.Text className="font-inter-medium text-sm leading-4 text-blue-700">
                  Mot de passe oublier?
                </text_1.Text>
              </button_1.Button>
            </react_native_1.View>
            <ui_1.Controller name="password" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input error={!!errors.password} isPassword Icon={lucide_react_native_1.Lock} ref={passwordInputRef} id="password" placeholder="********" returnKeyType="send" onSubmitEditing={handleSubmit(onSubmit)} onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>
            {errors.password && <field_1.FieldError>{errors.password.message}</field_1.FieldError>}
          </react_native_1.View>
          <CustomButton_1.CustomButton className=" mt-1 w-full" onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            {isSubmitting ? 'Connexion en cours...' : 'Connexion'}
          </CustomButton_1.CustomButton>
        </react_native_1.View>
        <react_native_1.View className="flex gap-6 px-4">
          <text_1.Text className=" text-md font-jost-medium w-full text-center text-muted-foreground">
            Ou continuer avec
          </text_1.Text>

          <social_section_1.SocialSections />
          <react_native_1.View className=" flex w-full flex-row items-center justify-center  text-center text-sm">
            <text_1.Text className="font-inter-meduim text-sm">Pas de compte? </text_1.Text>
            <react_native_1.Pressable onPress={() => {
            router.push('/auth/register');
        }}>
              <text_1.Text className="font-inter-semibold text-sm text-blue-700 underline underline-offset-4">
                Crée un compte
              </text_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.View>
      </card_1.CardContent>
    </card_1.Card>);
}
//# sourceMappingURL=sign-in-form.js.map