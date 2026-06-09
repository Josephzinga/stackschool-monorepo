'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvitationForm = CreateInvitationForm;
const react_1 = require("react");
const shared_1 = require("@stackschool/shared");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const textarea_1 = require("@/components/ui/textarea");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const field_1 = require("@/components/ui/field");
const react_phone_number_input_1 = __importDefault(require("react-phone-number-input"));
require("react-phone-number-input/style.css");
const lucide_react_1 = require("lucide-react");
function CreateInvitationForm({ schoolId, onSuccess, }) {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isEmail, setIsEmail] = (0, react_1.useState)(true);
    const { register, control, handleSubmit, formState: { errors }, } = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.createInvitationSchema),
        defaultValues: {
            schoolId,
            role: 'STUDENT',
            email: '',
            phoneNumber: '',
            message: '',
        },
    });
    async function onSubmit(data) {
        setIsLoading(true);
        try {
            await shared_1.api.post('/api/schools/invitations', data);
            sonner_1.toast.success('Invitation envoyée avec succès !');
            onSuccess?.();
        }
        catch (error) {
            const { message } = (0, shared_1.parseAxiosError)(error);
            console.error(message);
            sonner_1.toast.error(message || "Erreur lors de l'envoi de l'invitation.");
        }
        finally {
            setIsLoading(false);
        }
    }
    return (<div className="p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ui_1.Controller name="role" control={control} render={({ field }) => (<field_1.Field>
              <field_1.FieldLabel>Rôle invité</field_1.FieldLabel>
              <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Sélectionnez un rôle"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {ui_1.allRoles.map((r) => (<select_1.SelectItem value={r.value} key={r.value}>
                      {r.label}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>
              <field_1.FieldError errors={[{ message: errors.role?.message }]}/>
            </field_1.Field>)}/>

        <div className="flex flex-col gap-3">
          {isEmail ? (<field_1.Field>
              <field_1.FieldLabel htmlFor="emaim">Email</field_1.FieldLabel>
              <input_1.Input id="email" placeholder="exemple@email.com" {...register('email')}/>
              <field_1.FieldError errors={[{ message: errors.email?.message }]}/>
            </field_1.Field>) : (<field_1.Field>
              <field_1.FieldLabel htmlFor="phoneNumber">
                Téléphone (WhatsApp)
              </field_1.FieldLabel>
              <ui_1.Controller control={control} name="phoneNumber" render={({ field }) => (<react_phone_number_input_1.default onChange={field.onChange} value={field.value} className="phone-input-custom" international defaultCountry="ML"/>)}/>
              <field_1.FieldError errors={[{ message: errors.phoneNumber?.message }]}/>
            </field_1.Field>)}
          <button_1.Button variant="link" onClick={() => setIsEmail(!isEmail)} className="text-primary hover:text-primary/60 hover:underline">
            <span className="flex gap-2 ">
              {isEmail ? (<>
                  <lucide_react_1.Phone /> Utiliser un numéro de téléphone
                </>) : (<>
                  <lucide_react_1.Mail /> Utiliser l'adresse email{' '}
                </>)}
            </span>
          </button_1.Button>
        </div>

        <field_1.FieldDescription className="text-xs text-muted-foreground px-1">
          Remplissez au moins l'un des deux champs de contact.
        </field_1.FieldDescription>

        <field_1.FieldLabel>Message personnalisé (Optionnel)</field_1.FieldLabel>

        <textarea_1.Textarea placeholder="Bonjour, rejoignez notre école sur StackSchool..." className="resize-none" {...register('message')}/>

        <button_1.Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Envoi en cours...' : "Envoyer l'invitation"}
        </button_1.Button>
      </form>
    </div>);
}
//# sourceMappingURL=create-invitation-form.js.map