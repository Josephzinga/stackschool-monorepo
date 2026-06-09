'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = LoginForm;
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const icons_1 = require("./icons");
const react_1 = require("react");
const ui_1 = require("@stackschool/ui");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const spinner_1 = require("./ui/spinner");
const shared_1 = require("@stackschool/shared");
const button_social_1 = require("./button-social");
function LoginForm({ className, handleLogin, }) {
    const [showpwd, setShowpwd] = (0, react_1.useState)(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.loginFormSchema),
        mode: 'onBlur',
    });
    return (<>
      <card_1.Card className="max-w-lg w-100 md:w-md xl:w-lg py-4 gap-2 font-inter-local">
        <card_1.CardHeader className="text-center">
          <card_1.CardTitle className="text-xl lg:text-2xl!">Bienvenue</card_1.CardTitle>
          <card_1.CardDescription>
            Connecter vous à votre compte Google ou Facebook
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
            <field_1.FieldGroup className="gap-3">
              <field_1.Field>
                <button_social_1.ButtonSocial provider="google" icon={<icons_1.GoogleIcon />}/>
                <button_social_1.ButtonSocial provider="facebook" icon={<icons_1.FacebookIcon />}/>
              </field_1.Field>
              <field_1.FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Ou continuer avec
                </span>
              </field_1.FieldSeparator>
              <field_1.Field className="last:mt-0">
                <field_1.FieldLabel htmlFor="email">
                  Email ou nom d&apos;utilisateur
                </field_1.FieldLabel>
                <input_1.Input placeholder="exmple@example.com" icon={lucide_react_1.Mail} id="email" type="text" required autoComplete="name" {...register('identifier')} aria-describedby={errors.identifier ? 'identifier-error' : undefined} aria-invalid={!!errors.identifier}/>

                <field_1.FieldError id="identifier-error">
                  {errors.identifier?.message}{' '}
                </field_1.FieldError>
              </field_1.Field>
              <field_1.Field>
                <div className="flex items-center relative">
                  <field_1.FieldLabel htmlFor="password">Mot de passe</field_1.FieldLabel>
                  <link_1.default href="/auth/forgot-password" className="ml-auto text-sm font-semibold hover:underline hover:text-primary/50">
                    Mot de passe oublier?
                  </link_1.default>
                </div>
                <div className="relative">
                  <input_1.Input icon={lucide_react_1.Lock} {...register('password')} id="password" type={showpwd ? 'text' : 'password'} required placeholder="********" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}/>
                  <button aria-label="Toggle password visibility" type="button" tabIndex={-1} onClick={() => setShowpwd((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    {showpwd ? <lucide_react_1.Eye size={18}/> : <lucide_react_1.EyeOff size={18}/>}
                  </button>
                </div>
                <field_1.FieldError id="password-error">
                  {errors.password?.message}
                </field_1.FieldError>
              </field_1.Field>
              <field_1.Field>
                <button_1.Button disabled={isSubmitting} type="submit" className={(0, utils_1.cn)('font-semibold', isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer')}>
                  {isSubmitting ? (<>
                      <spinner_1.Spinner /> Connection en cours...
                    </>) : ('Connexion')}
                </button_1.Button>
                <field_1.FieldDescription className="text-center">
                  Pas de compte ?{' '}
                  <link_1.default href="/auth/register">Creé un compte</link_1.default>
                </field_1.FieldDescription>
              </field_1.Field>
            </field_1.FieldGroup>
          </form>
        </card_1.CardContent>
      </card_1.Card>
    </>);
}
//# sourceMappingURL=login-form.js.map