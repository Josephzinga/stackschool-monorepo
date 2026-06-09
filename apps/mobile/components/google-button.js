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
exports.default = GoogleLoginButton;
const react_1 = __importStar(require("react"));
const google_signin_1 = require("@react-native-google-signin/google-signin");
const api_1 = __importStar(require("@stackschool/shared/src/lib/api"));
const social_button_1 = require("./social-button");
const token_storage_1 = require("@/lib/token-storage");
const expo_router_1 = require("expo-router");
const react_native_toast_message_1 = __importDefault(require("react-native-toast-message"));
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
function GoogleLoginButton() {
    (0, react_1.useEffect)(() => {
        google_signin_1.GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            offlineAccess: true,
        });
    }, []);
    const strategy = {
        provider: 'google',
        source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
        useTint: false,
    };
    const handleGoogleLogin = async () => {
        try {
            await google_signin_1.GoogleSignin.hasPlayServices();
            const userInfo = await google_signin_1.GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;
            if (!idToken) {
                console.log("Erreur : Aucun ID Token n'a été généré");
                return;
            }
            console.log('Envoi du token à l’API...', idToken);
            const res = await api_1.default.post('/auth/google', { idToken });
            console.log('Réponse API:', res.data.user);
            console.log('Session', res.data.session);
            const { data } = res;
            await (0, token_storage_1.saveSession)(res.data.session);
            if (data.ok) {
                react_native_toast_message_1.default.show({
                    type: 'success',
                    text1: data.message || 'Authentification réuissi avec succé!',
                    text1Style: { color: 'green' },
                });
                if (data.user.completeProfiled) {
                    expo_router_1.router.push('/auth/complete-profile');
                }
            }
        }
        catch (error) {
            if (error.code === google_signin_1.statusCodes.SIGN_IN_CANCELLED) {
                console.log('Utilisateur a annulé la connexion');
            }
            else if (error.code === google_signin_1.statusCodes.IN_PROGRESS) {
                console.log('Connexion déjà en cours');
            }
            else if (error.code === google_signin_1.statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Services Google Play non disponibles');
            }
            else {
                const { message } = (0, api_1.parseAxiosError)(error);
                console.log('Erreur détaillée:', message);
            }
        }
    };
    return <social_button_1.SocialButton strategy={strategy} onPress={handleGoogleLogin}/>;
}
//# sourceMappingURL=google-button.js.map