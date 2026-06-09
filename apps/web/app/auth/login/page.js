'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const shared_1 = require("@stackschool/shared");
const login_form_1 = require("@/components/login-form");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const Container_1 = require("@/components/Container");
function LoginPage() {
    const router = (0, navigation_1.useRouter)();
    const handleLogin = async ({ identifier, password }) => {
        try {
            const res = await shared_1.authServices.login({
                identifier,
                password,
            });
            if (res.ok) {
                router.push(`/auth/finish?from=${res.user.provider}`);
            }
            sonner_1.toast.success(res.message || 'Connexion réussie');
        }
        catch (err) {
            const { message, data, status } = (0, shared_1.parseAxiosError)(err);
            console.log('message', message);
            if (data?.isSocialOnly) {
                return sonner_1.toast.warning(data.message);
            }
            sonner_1.toast.error(message || 'Erreur de connexion');
        }
    };
    return (<Container_1.Container className="font-inter">
      <login_form_1.LoginForm handleLogin={handleLogin}/>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map