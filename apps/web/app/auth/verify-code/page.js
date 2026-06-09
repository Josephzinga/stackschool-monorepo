'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyCode;
const Container_1 = require("@/components/Container");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const field_1 = require("@/components/ui/field");
const input_otp_1 = require("@/components/ui/input-otp");
const ui_1 = require("@stackschool/ui");
const shared_1 = require("@stackschool/shared");
const input_otp_2 = require("input-otp");
const link_1 = __importDefault(require("next/link"));
const spinner_1 = require("@/components/ui/spinner");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const react_1 = require("react");
function VerifyCode() {
    const router = (0, navigation_1.useRouter)();
    const [countdown, setCountdown] = (0, react_1.useState)(0);
    const { control, handleSubmit, formState: { isSubmitting, errors }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.VerifyCodeSchema),
        mode: 'onBlur',
    });
    (0, react_1.useEffect)(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);
    const handleCode = async ({ code }) => {
        try {
            const res = await shared_1.authServices.verifyCode(code, null);
            sonner_1.toast.success(res.message);
            if (res.ok) {
                router.push(`/auth/reset-password`);
            }
        }
        catch (error) {
            const { message } = (0, shared_1.parseAxiosError)(error);
            sonner_1.toast.error(message || 'Code invalide ou éxpiré');
            document.getElementById('code')?.focus();
        }
    };
    const handleResendCode = async () => {
        try {
            const res = await shared_1.authServices.resendCode();
            if (res.ok) {
                sonner_1.toast.success(res.message || 'Nouveau code envoyé');
                setCountdown(60);
            }
        }
        catch (error) {
            const { message } = (0, shared_1.parseAxiosError)(error);
            sonner_1.toast.error(message || "Erreur lors de l'envoi");
        }
    };
    return (<Container_1.Container>
      <card_1.Card className="w-100! max-w-md mx-auto">
        <card_1.CardHeader className="text-center">
          <card_1.CardTitle className="text-xl">Vérification du code</card_1.CardTitle>
          <card_1.CardDescription>
            Entrez le code à 6 chiffres envoyé sur WhatsApp
          </card_1.CardDescription>
        </card_1.CardHeader>

        <card_1.CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleCode)} className="space-y-4">
            <field_1.Field>
              <field_1.FieldLabel htmlFor="code" className="text-center block">
                Code de vérification
              </field_1.FieldLabel>

              <div className="flex justify-center">
                <ui_1.Controller name="code" control={control} render={({ field }) => (<input_otp_1.InputOTP {...field} id="code" maxLength={6} pattern={input_otp_2.REGEXP_ONLY_DIGITS} className="justify-center">
                      <input_otp_1.InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (<input_otp_1.InputOTPSlot key={index} index={index} className="w-10 h-10 text-lg border" aria-invalid={!!errors.code}/>))}
                      </input_otp_1.InputOTPGroup>
                    </input_otp_1.InputOTP>)}/>
              </div>
              <div className="w-full flex justify-center mt-1">
                <field_1.FieldError className="mx-auto">
                  {errors.code?.message}
                </field_1.FieldError>
              </div>
            </field_1.Field>

            <button_1.Button type="submit" className="w-full  font-semibold" disabled={isSubmitting}>
              {isSubmitting ? (<>
                  <spinner_1.Spinner className="mr-2"/>
                  Vérification...
                </>) : ('Vérifier le code')}
            </button_1.Button>
          </form>

          
          <div className="text-center space-y-3">
            {countdown > 0 ? (<p className="text-sm ">
                Nouveau code sera disponible dans{' '}
                <span className="font-medium">{countdown}</span> secondes
              </p>) : (<button type="button" onClick={handleResendCode} className="hover:underline text-sm">
                Renvoyer le code
              </button>)}

            <div className="pt-4 border-t">
              <link_1.default href="/auth/login" className="hover:underline text-sm">
                ← Retour à la connexion
              </link_1.default>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map