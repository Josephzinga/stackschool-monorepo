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
exports.SignUpForm = SignUpForm;
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const text_1 = require("@/components/ui/text");
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const ui_1 = require("@stackschool/ui");
const react_native_toast_message_1 = __importDefault(require("react-native-toast-message"));
const shared_1 = require("@stackschool/shared");
const expo_router_1 = require("expo-router");
const field_1 = require("./field");
const lucide_react_native_1 = require("lucide-react-native");
const CustomButton_1 = require("@/components/CustomButton");
const Logo_1 = __importDefault(require("@/components/Logo"));
function SignUpForm() {
    const { handleSubmit, control, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({ resolver: (0, ui_1.zodResolver)(shared_1.registerFormSchema), mode: 'onBlur' });
    const router = (0, expo_router_1.useRouter)();
    const phoneNumberInputRef = React.useRef(null);
    const emailInputRef = React.useRef(null);
    const passwordInputRef = React.useRef(null);
    const confirmPasswordInputRef = React.useRef(null);
    function onUsernameSubmitEditing() {
        phoneNumberInputRef.current?.focus();
    }
    function onPhoneNumberSubmitEditing() {
        emailInputRef.current?.focus();
    }
    function onEmailSubmitEditing() {
        passwordInputRef.current?.focus();
    }
    async function onSubmit({ username, phoneNumber, email, password, confirm }) {
        try {
            const res = await shared_1.authServices.register({
                username,
                phoneNumber,
                email,
                password,
                confirm,
            });
            if (res.ok) {
                if (res.profileCompleted) {
                    router.replace('/auth/complete-profile');
                }
                react_native_toast_message_1.default.show({
                    type: 'success',
                    text1: res.message || 'Authentification réussi',
                });
            }
        }
        catch (err) {
            const { message } = (0, shared_1.parseAxiosError)(err);
            react_native_toast_message_1.default.show({
                type: 'error',
                text1: message || 'Registration Failed',
            });
            console.log(err.message);
        }
    }
    return (<card_1.Card className=" h-full py-4">
      <card_1.CardHeader className="">
        <Logo_1.default />
        <card_1.CardTitle className=" text-center text-xl sm:text-left">Crée un compte</card_1.CardTitle>
        <card_1.CardDescription className="text-center sm:text-left">
          Connecter vous à votre compte Google ou Facebook
        </card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent className="h-full gap-4">
        <react_native_1.View className="gap-4">
          <react_native_1.View className="gap-1">
            <label_1.Label htmlFor="username">Nom d'utilisateur</label_1.Label>
            <ui_1.Controller name="username" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input Icon={lucide_react_native_1.User} id="username" placeholder="John Doe" autoCapitalize="words" onSubmitEditing={onUsernameSubmitEditing} returnKeyType="next" onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>

            {errors.username && <field_1.FieldError>{errors.username?.message}</field_1.FieldError>}
          </react_native_1.View>
          <react_native_1.View className="gap-1">
            <label_1.Label htmlFor="phoneNumber">Numéro de télephone</label_1.Label>
            <ui_1.Controller name="phoneNumber" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input Icon={lucide_react_native_1.Phone} ref={phoneNumberInputRef} id="phoneNumber" placeholder="+1 234 567 890" keyboardType="phone-pad" autoComplete="tel" onSubmitEditing={onPhoneNumberSubmitEditing} returnKeyType="next" onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>
            {errors.phoneNumber && <field_1.FieldError>{errors.phoneNumber?.message}</field_1.FieldError>}
          </react_native_1.View>
          <react_native_1.View className="gap-1">
            <label_1.Label htmlFor="email">Email</label_1.Label>
            <ui_1.Controller name="email" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input Icon={lucide_react_native_1.Mail} ref={emailInputRef} id="email" placeholder="m@example.com" keyboardType="email-address" autoComplete="email" autoCapitalize="none" onSubmitEditing={onEmailSubmitEditing} returnKeyType="next" onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>
            {errors.email && (<field_1.FieldError className="text-destructive">{errors.email.message}</field_1.FieldError>)}
          </react_native_1.View>
          <react_native_1.View className="gap-1">
            <label_1.Label htmlFor="password">Mot de passe</label_1.Label>
            <ui_1.Controller name="password" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input Icon={lucide_react_native_1.Lock} isPassword ref={passwordInputRef} id="password" placeholder="********" onSubmitEditing={() => confirmPasswordInputRef.current?.focus()} returnKeyType="next" onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>
            {errors.password && <field_1.FieldError>{errors.password?.message}</field_1.FieldError>}
          </react_native_1.View>
          <react_native_1.View className="gap-1">
            <label_1.Label htmlFor="confirm">Confirmer le mot de passe</label_1.Label>
            <ui_1.Controller name="confirm" control={control} render={({ field: { onChange, onBlur, value } }) => (<input_1.Input ref={confirmPasswordInputRef} Icon={lucide_react_native_1.Lock} isPassword id="confirm" secureTextEntry placeholder="********" onSubmitEditing={handleSubmit(onSubmit)} returnKeyType="send" onBlur={onBlur} onChangeText={onChange} value={value}/>)}/>
            {errors.confirm && <field_1.FieldError>{errors.confirm?.message}</field_1.FieldError>}
          </react_native_1.View>
          <CustomButton_1.CustomButton className="w-full" onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
          </CustomButton_1.CustomButton>
        </react_native_1.View>

        <react_native_1.View className="flex flex-row justify-center gap-1 text-sm">
          <text_1.Text className="font-inter-semibold text-sm text-muted-foreground">
            {' '}
            Déjà un compte?
          </text_1.Text>
          <react_native_1.Pressable onPress={() => {
            if (router.canGoBack()) {
                router.back();
            }
            else {
                router.replace('/auth/sign-in');
            }
        }}>
            <text_1.Text className="font-inter-semibold text-sm text-blue-700 underline underline-offset-4">
              Connexion
            </text_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>
      </card_1.CardContent>
    </card_1.Card>);
}
//# sourceMappingURL=sign-up-form.js.map