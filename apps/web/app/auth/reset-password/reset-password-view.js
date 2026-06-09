'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleFallBack = exports.onSubmit = void 0;
const shared_1 = require("@stackschool/shared");
const sonner_1 = require("sonner");
const client_1 = require("next/client");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const Container_1 = require("@/components/Container");
const lucide_react_1 = require("lucide-react");
const onSubmit = async (data, onSuccess, token) => {
    if (!token) {
        sonner_1.toast.error('Token de réinitialisation manquant');
        return;
    }
    try {
        const res = await shared_1.authServices.resetPassword(token, data.password, data.confirm);
        if (res.ok) {
            onSuccess(true);
            sonner_1.toast.success(res.data?.message || 'Mot de passe réinitialisé avec succès');
            setTimeout(() => {
                client_1.router.push('/auth/login');
            }, 3000);
        }
    }
    catch (error) {
        const { message } = (0, shared_1.parseAxiosError)(error);
        sonner_1.toast.error(message || 'Erreur lors de la réinitialisation');
        if (error.response?.status === 400) {
            setTimeout(() => {
                client_1.router.push('/auth/forgot-password');
            }, 2000);
        }
    }
};
exports.onSubmit = onSubmit;
const HandleFallBack = ({ searchParams, }) => {
    const { token, method } = (0, react_1.use)(searchParams);
    if (!token && !method && method === 'email') {
        return (<Container_1.Container>
        <card_1.Card className="max-w-md w-100! mx-auto text-center bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
          <card_1.CardContent className="space-y-4 py-8">
            <lucide_react_1.AlertCircle className="w-16 h-16 text-red-500 mx-auto"/>
            <h2 className="text-2xl font-bold">Lien invalide</h2>
            <p>Le lien de réinitialisation est invalide ou a expiré.</p>
            <button_1.Button className="text-white font-semibold" onClick={() => client_1.router.push('/auth/forgot-password')}>
              Demander un nouveau lien
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>
      </Container_1.Container>);
    }
};
exports.HandleFallBack = HandleFallBack;
//# sourceMappingURL=reset-password-view.js.map