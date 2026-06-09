'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
const navigation_1 = require("next/navigation");
const shared_1 = require("@stackschool/shared");
const field_1 = require("@/components/ui/field");
const link_1 = __importDefault(require("next/link"));
const card_1 = require("@/components/ui/card");
const icons_1 = require("@/components/icons");
const input_1 = require("@/components/ui/input");
const spinner_1 = require("@/components/ui/spinner");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const Container_1 = require("@/components/Container");
const button_social_1 = require("@/components/button-social");
require("react-phone-number-input/style.css");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
const react_1 = require("react");
function RegisterPage() {
    const router = (0, navigation_1.useRouter)();
    const [isValid, setIsValid] = (0, react_1.useState)();
    const { handleSubmit, register, control, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.registerFormSchema),
        mode: 'onBlur',
    });
    async function handleRegister(data) {
        try {
            const res = await shared_1.authServices.register(data);
            if (res.ok) {
                sonner_1.toast.success(res.message);
                router.push(`/auth/finish?from=${res.user.provider}`);
            }
        }
        catch (err) {
            const error = (0, shared_1.parseAxiosError)(err);
            sonner_1.toast.error(error.message || 'Une erreur est survenue.');
        }
    }
    return (<Container_1.Container>
      <card_1.Card className="max-w-lg w-100 md:w-md gap-4">
        <card_1.CardHeader className="text-center mt-4">
          <card_1.CardTitle className="text-xl">Bienvenue</card_1.CardTitle>
          <card_1.CardDescription>
            Connectez-vous à votre compte Google ou Facebook
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handleSubmit(handleRegister)} className="mt-0">
            <field_1.FieldGroup className="gap-1.5 md:gap-2 text-sm md:text-base">
              <field_1.Field>
                <button_social_1.ButtonSocial provider="google" icon={<icons_1.GoogleIcon />}/>
                <button_social_1.ButtonSocial provider="facebook" icon={<icons_1.FacebookIcon />}/>
              </field_1.Field>
              <field_1.FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-1">
                <span className="font-medium font-jost text-sm ">
                  Ou continuer avec
                </span>
              </field_1.FieldSeparator>
              <field_1.Field className=" mt-3">
                <field_1.FieldLabel htmlFor="username">
                  Nom d&apos;utilisateur
                </field_1.FieldLabel>
                <input_1.Input id="username" type="text" required icon={lucide_react_1.User} autoComplete="name" placeholder="John Doe" aria-invalid={!!errors.username} aria-describedby="username-error" {...register('username')}/>

                <field_1.FieldError id="username-error">
                  {errors.username?.message}{' '}
                </field_1.FieldError>
              </field_1.Field>
              <field_1.Field>
                <field_1.FieldLabel htmlFor="email">Email</field_1.FieldLabel>
                <input_1.Input icon={lucide_react_1.Mail} id="email" type="email" placeholder="john.doe@example.com" {...register('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}/>
                <field_1.FieldError id="email-error">
                  {errors.email?.message}{' '}
                </field_1.FieldError>
              </field_1.Field>
              <field_1.Field>
                <field_1.FieldLabel htmlFor="phoneNumber">Numéro WhatsApp</field_1.FieldLabel>

                <ui_1.Controller name="phoneNumber" control={control} render={({ field }) => (<react_phone_number_input_1.default {...field} id="phoneNumber" placeholder="+223 07 12 34 56 78" defaultCountry="ML" className="phone-input-custom " onCountryChange={(country) => console.log('contry', country)} international/>)}/>

                <field_1.FieldError id="error-phone">
                  {errors.phoneNumber?.message}{' '}
                </field_1.FieldError>
              </field_1.Field>
              <field_1.Field>
                <field_1.FieldLabel htmlFor="password">Mot de passe</field_1.FieldLabel>

                <input_1.Input isPassword icon={lucide_react_1.Lock} {...register('password')} id="password" required autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}/>

                <field_1.FieldError id="password-error">
                  {errors.password?.message}{' '}
                </field_1.FieldError>
              </field_1.Field>
              <field_1.Field className="gap-1.5 ">
                <field_1.FieldLabel htmlFor="confirm">
                  Confirmer le mot de passe
                </field_1.FieldLabel>
                <input_1.Input isPassword id="confirm" type="password" icon={lucide_react_1.Lock} {...register('confirm')} aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? 'confirm-error' : undefined}/>
                <field_1.FieldError id="confirm-error">
                  {errors.confirm?.message}
                </field_1.FieldError>
              </field_1.Field>

              <field_1.Field>
                <button_1.Button type="submit" className="font-semibold text-white mt-2">
                  {isSubmitting ? (<>
                      <spinner_1.Spinner /> Inscription en cours...
                    </>) : (<span>S&apos;inscrire</span>)}
                </button_1.Button>
                <field_1.FieldDescription className="text-center">
                  Déjà un compte ? <link_1.default href="/auth/login">Connexion</link_1.default>
                </field_1.FieldDescription>
              </field_1.Field>
            </field_1.FieldGroup>
          </form>
        </card_1.CardContent>
      </card_1.Card>
    </Container_1.Container>);
}
//# sourceMappingURL=page.js.map