'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ForgotPasswordPage;
const Container_1 = require("@/components/Container");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const spinner_1 = require("@/components/ui/spinner");
const shared_1 = require("@stackschool/shared");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const lucide_react_1 = require("lucide-react");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
require("react-phone-number-input/style.css");
const react_1 = require("react");
function ForgotPasswordPage() {
    const [inputType, setInputType] = (0, react_1.useState)('any');
    const [phoneValue, setPhoneValue] = (0, react_1.useState)('');
    const router = (0, navigation_1.useRouter)();
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isValid }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.forgotPasswordSchema),
        mode: 'onBlur',
    });
    const detectInputType = (value) => {
        if (value.includes('@') && value.includes('.')) {
            return 'email';
        }
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value)) {
            return 'phone';
        }
        return 'any';
    };
    const handleIdentifierChange = (value) => {
        const detectedType = detectInputType(value);
        setInputType(detectedType);
        if (detectedType === 'phone') {
            setPhoneValue(value);
        }
    };
    const handleIdentifier = async (data) => {
        let identifier = data.identifier;
        if (inputType === 'phone' && phoneValue) {
            identifier = phoneValue;
        }
        try {
            const res = await shared_1.authServices.forgotPassword(identifier);
            if (res.ok) {
                sonner_1.toast.success(res.message);
                if (res.method === 'whatsapp') {
                    setTimeout(() => router.push(`/auth/verify-code}`), 1000);
                }
            }
        }
        catch (error) {
            const { message } = (0, shared_1.parseAxiosError)(error);
            sonner_1.toast.error(message || 'Erreur réseau');
        }
    };
    return (<Container_1.Container>
      <card_1.Card className="backdrop-sm w-110  ">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-center ">
            Récupération de mot de passe
          </card_1.CardTitle>
          <card_1.CardDescription className="text-center">
            Entrez votre email, numéro WhatsApp ou nom d&apos;utilisateur pour
            recevoir un code de réinitialisation
          </card_1.CardDescription>
        </card_1.CardHeader>

        <card_1.CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(handleIdentifier)} className="space-y-3">
            <field_1.Field>
              <field_1.FieldLabel htmlFor="identifier">
                Entrez votre email, nom complet ou numéro
              </field_1.FieldLabel>

              {inputType === 'phone' ? (<react_phone_number_input_1.default international defaultCountry="ML" className="phone-input-custom" value={phoneValue} onChange={(value) => {
                setPhoneValue(value || '');
                setValue('identifier', value || '');
            }} onBlur={() => {
                if (phoneValue) {
                    setValue('identifier', phoneValue);
                }
            }} placeholder="+223 07 12 34 56 78"/>) : (<input_1.Input id="identifier" className="placeholder:text-sm" aria-invalid={!!errors.identifier} type="text" {...register('identifier', {
            onChange: (e) => handleIdentifierChange(e.target.value),
        })}/>)}
              {errors.identifier && (<field_1.FieldError id="error-identifier" className="flex gap-1">
                  <lucide_react_1.AlertCircle className="w-3 h-3 md:w-4 md:h-4"/>
                  {errors.identifier.message}
                </field_1.FieldError>)}

              <button type="button" onClick={() => {
            if (inputType === 'phone') {
                setValue('identifier', '');
                setInputType('any');
            }
            else {
                setInputType('phone');
                setValue('identifier', '');
                setPhoneValue('');
            }
        }} className="text-sm text-primary hover:underline flex gap-1">
                {inputType === 'phone' ? ("← Utiliser un email ou nom d'utilisateur à la place") : (<>
                    <lucide_react_1.PhoneIcon size={17}/> Utiliser un numéro de téléphone à la
                    place
                  </>)}
              </button>
            </field_1.Field>

            <button_1.Button type="submit" className="w-full  mt-4 font-semibold font-inter" disabled={isSubmitting}>
              {isSubmitting ? (<>
                  <spinner_1.Spinner />
                  Envoi en cours...
                </>) : ('Recevoir le code de réinitialisation')}
            </button_1.Button>
          </form>

          <div className="text-center space-y-3">
            <link_1.default href="/auth/login" className="hover:underline block text-sm text-primary/90 font-inter ">
              ← Retour à la connexion
            </link_1.default>

            <p className="text-sm font-jost text-foreground/85 tracking-tight">
              Vous recevrez un lien par email ou un code WhatsApp Valable
              pendant 15 minutes
            </p>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map