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
exports.default = FacebookLoginButton;
const react_1 = __importDefault(require("react"));
const react_native_fbsdk_next_1 = require("react-native-fbsdk-next");
const api_1 = __importStar(require("@stackschool/shared/src/lib/api"));
const social_button_1 = require("./social-button");
const token_storage_1 = require("@/lib/token-storage");
const react_native_toast_message_1 = __importDefault(require("react-native-toast-message"));
const expo_router_1 = require("expo-router");
function FacebookLoginButton() {
    const strategy = {
        provider: 'facebook',
        source: { uri: 'https://img.clerk.com/static/facebook.png?width=160' },
        useTint: false,
    };
    const handleFacebookLogin = async () => {
        try {
            const result = await react_native_fbsdk_next_1.LoginManager.logInWithPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                react_native_toast_message_1.default.show({
                    type: 'error',
                    text1: 'Connexion annulée',
                });
                return;
            }
            const accessData = await react_native_fbsdk_next_1.AccessToken.getCurrentAccessToken();
            if (!accessData) {
                throw new Error('Erreur lors de la récupération du token Facebook');
            }
            const accessToken = accessData.accessToken.toString();
            console.log('Access Token', accessToken);
            console.log('Envoi du token Facebook à l’API...');
            const res = await api_1.default.post('/auth/facebook', { accessToken });
            const { data } = res;
            if (data.ok) {
                await (0, token_storage_1.saveSession)(res.data.session);
                if (data.ok) {
                    react_native_toast_message_1.default.show({
                        type: 'success',
                        text1: data.message || 'Authentification réuissi avec succé!',
                        text1Style: { color: 'green' },
                    });
                    if (!data.user.profileCompleted) {
                        expo_router_1.router.push('/auth/complete-profile');
                    }
                    expo_router_1.router.push('/home');
                }
            }
            console.log('Réponse API:', res.data);
        }
        catch (error) {
            const { message } = (0, api_1.parseAxiosError)(error);
            console.log('Erreur Facebook:', message);
        }
    };
    return <social_button_1.SocialButton strategy={strategy} onPress={handleFacebookLogin}/>;
}
//# sourceMappingURL=facebook-button.js.map