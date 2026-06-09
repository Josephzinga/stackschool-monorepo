'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeacherForm = CreateTeacherForm;
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const submit_button_1 = require("@/components/submit-button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const shared_1 = require("@stackschool/shared");
require("react-phone-number-input/style.css");
const field_1 = require("@/components/ui/field");
const react_query_1 = require("@tanstack/react-query");
const react_hook_form_1 = require("react-hook-form");
const profile_sub_form_1 = require("@/components/school/form/profile-sub-form");
function CreateTeacherForm({ onSuccess, editDefaultValues, }) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const methods = (0, ui_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.createTeacherSchema),
        mode: 'onBlur',
        defaultValues: {
            lastname: editDefaultValues?.lastname || '',
            gender: editDefaultValues?.gender,
            firstname: editDefaultValues?.firstname || '',
            email: editDefaultValues?.email || '',
            phoneNumber: editDefaultValues?.phoneNumber || '',
            diploma: editDefaultValues?.diploma || '',
            specialization: editDefaultValues?.specialization,
        },
    });
    const { register, handleSubmit, watch, setError, clearErrors, control, formState: { errors, isSubmitting }, } = methods;
    const { mutateAsync: createMutateAsync } = (0, ui_1.useCreateTeacherMutation)({
        onSuccess: async () => {
            if (onSuccess)
                onSuccess();
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
        },
    });
    const { mutateAsync: updateMutateAsync } = (0, ui_1.useUpdateTeacherMutation)({
        onSuccess: async () => {
            if (onSuccess)
                onSuccess();
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
        },
    });
    const isEdit = !!editDefaultValues;
    const onSubmit = async (data) => {
        const promise = isEdit
            ? updateMutateAsync({
                data,
                teacherId: editDefaultValues?.id,
            })
            : createMutateAsync({
                input: data,
            });
        sonner_1.toast.promise(promise, {
            loading: isEdit ? 'Modification en cours...' : 'Création en cours...',
            success: (data) => {
                return isEdit
                    ? data?.updateTeacher?.message || 'Enseignant modifié avec succès'
                    : data?.createTeacher?.message || 'Enseignant créé avec succès';
            },
            error: (error) => error.message || 'Une erreur est survenue',
            toasterId: 'dashboard',
        });
    };
    return (<react_hook_form_1.FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <profile_sub_form_1.ProfileSubForm />

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <field_1.Field>
            <field_1.FieldLabel>Diplôme</field_1.FieldLabel>
            <input_1.Input {...register('diploma')} aria-invalid={!!errors.diploma} placeholder="Master, CAP..."/>
            <field_1.FieldError>{errors.diploma?.message}</field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel>Spécialité</field_1.FieldLabel>
            <input_1.Input {...register('specialization')} aria-invalid={!!errors.specialization} placeholder="Mathématiques"/>
            <field_1.FieldError>{errors.specialization?.message}</field_1.FieldError>
          </field_1.Field>
        </div>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="gender">Genre</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="gender" render={({ field }) => (<select_1.Select onValueChange={field.onChange} value={field.value}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Sélectionnez le genre"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value={shared_1.GenderEnum.Female}>Homme</select_1.SelectItem>
                  <select_1.SelectItem value={shared_1.GenderEnum.Male}>Femme</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>)}/>
          <field_1.FieldError>{errors.gender?.message}</field_1.FieldError>
        </field_1.Field>

        <div className="flex justify-end pt-4">
          <submit_button_1.SubmitButton isSubmitting={isSubmitting}>
            {isEdit ? 'Modifier' : "Créer l'enseignant"}
          </submit_button_1.SubmitButton>
        </div>
      </form>
    </react_hook_form_1.FormProvider>);
}
//# sourceMappingURL=create-teacher-form.js.map