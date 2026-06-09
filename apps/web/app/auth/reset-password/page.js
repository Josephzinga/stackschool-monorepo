'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPasswordPage;
const Container_1 = require("@/components/Container");
const card_1 = require("@/components/ui/card");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const shared_1 = require("@stackschool/shared");
const zod_1 = require("@hookform/resolvers/zod");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const submit_button_1 = require("@/components/submit-button");
const reset_password_view_1 = require("@/app/auth/reset-password/reset-password-view");
const reset_password_view_2 = require("./reset-password-view");
function ResetPasswordPage({ searchParams, }) {
    const [isSuccess, setIsSuccess] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(shared_1.resetPasswordSchema),
        mode: 'onChange',
    });
    const passwordValue = watch('password');
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
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password))
            strength++;
        return strength;
    };
    const passwordStrength = getPasswordStrength(passwordValue);
    if (isSuccess) {
        return (<Container_1.Container>
        <card_1.Card className="max-w-md mx-auto text-center w-100!">
          <card_1.CardContent className="space-y-4 py-8">
            <lucide_react_1.CheckCircle2 className="w-16 h-16 text-green-500 mx-auto"/>
            <h2 className="text-2xl font-bold">Mot de passe réinitialisé !</h2>
            <p>Votre mot de passe a été modifié avec succès.</p>
            <p className="text-sm text-gray-600">
              Redirection vers la page de connexion...
            </p>
          </card_1.CardContent>
        </card_1.Card>
      </Container_1.Container>);
    }
    if (!isSuccess) {
        return (<react_1.Suspense fallback={''}>
        <reset_password_view_1.HandleFallBack searchParams={searchParams}/>
      </react_1.Suspense>);
    }
    return (<Container_1.Container>
      <card_1.Card className="max-w-md mx-auto w-100! font-poppins">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-center">Nouveau mot de passe</card_1.CardTitle>
          <card_1.CardDescription className="text-center">
            Choisissez un nouveau mot de passe sécurisé
          </card_1.CardDescription>
        </card_1.CardHeader>

        <card_1.CardContent>
          <form onSubmit={handleSubmit((data) => (0, reset_password_view_2.onSubmit)?.(data, setIsSuccess))} className="space-y-4">
            
            <field_1.Field>
              <field_1.FieldLabel>Nouveau mot de passe</field_1.FieldLabel>
              <input_1.Input icon={lucide_react_1.Lock} isPassword {...register('password')} placeholder="********" aria-invalid={!!errors.password}/>

              <field_1.FieldError>{errors.password?.message}</field_1.FieldError>
              
              {passwordValue && (<div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (<div key={level} className={`h-1 flex-1 rounded ${level <= passwordStrength
                    ? level <= 2
                        ? 'bg-red-500'
                        : level <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                    : 'bg-gray-200'}`}/>))}
                  </div>
                  <div className="text-xs text-gray-600">
                    {passwordStrength <= 2 && 'Faible'}
                    {passwordStrength === 3 && 'Moyen'}
                    {passwordStrength >= 4 && 'Fort'}
                  </div>
                </div>)}
            </field_1.Field>

            <field_1.Field>
              <field_1.FieldLabel>Confirmer le mot de passe</field_1.FieldLabel>
              <input_1.Input isPassword {...register('confirm')} aria-invalid={!!errors.confirm}/>

              <field_1.FieldError>{errors.confirm?.message}</field_1.FieldError>
            </field_1.Field>
            <submit_button_1.SubmitButton className="w-full font-poppins" isSubmitting={isSubmitting}>
              {isSubmitting
            ? 'Réinitialisation en cours...'
            : 'Réinitialiser le mot de passe'}
            </submit_button_1.SubmitButton>
          </form>

          <div className="mt-6 text-center">
            <link_1.default href="/auth/login" className="text-primary hover:underline text-sm">
              ← Retour à la connexion
            </link_1.default>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map