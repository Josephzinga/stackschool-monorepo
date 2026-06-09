'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationForm = InvitationForm;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const ui_1 = require("@stackschool/ui");
const zod_1 = require("zod");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const sonner_1 = require("sonner");
const shared_1 = require("@stackschool/shared");
const field_1 = require("@/components/ui/field");
const verifyInvitationSchema = zod_1.z.object({
    invitationCode: zod_1.z.string().min(1, "Le code d'invitation est requis"),
});
function InvitationForm() {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { setSchoolData } = (0, ui_1.useCompleteProfileStore)();
    const { register, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, ui_1.zodResolver)(verifyInvitationSchema),
        defaultValues: {
            invitationCode: '',
        },
        mode: 'onBlur',
    });
    async function onSubmit(data) {
        setIsLoading(true);
        try {
            const res = await shared_1.api.post('/api/complete-profile/verify-invitation', data);
            if (res.data.ok) {
                sonner_1.toast.success('Code valide !');
                setSchoolData({
                    type: 'invite',
                    invitationCode: data.invitationCode,
                });
            }
        }
        catch (error) {
            const { message } = (0, shared_1.parseAxiosError)(error);
            sonner_1.toast.error(message || "Code d'invitation invalide.");
        }
        finally {
            setIsLoading(false);
        }
    }
    return (<div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <field_1.Field>
          <field_1.FieldLabel>Code d'invitation</field_1.FieldLabel>

          <input_1.Input placeholder="Entrez votre code reçu par SMS/Email" {...register('invitationCode')}/>

          <field_1.FieldError errors={[{ message: errors.invitationCode?.message }]}/>
        </field_1.Field>

        <button_1.Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Vérification...' : "Rejoindre l'école"}
        </button_1.Button>
      </form>
    </div>);
}
//# sourceMappingURL=invitation-form.js.map