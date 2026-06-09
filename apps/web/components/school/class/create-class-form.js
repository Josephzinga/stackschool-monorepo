'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateClassForm;
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("zod");
const zod_2 = require("@hookform/resolvers/zod");
const grid_form_1 = require("@/components/school/grid-form");
const select_1 = require("@/components/ui/select");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const submit_button_1 = require("@/components/submit-button");
const react_query_1 = require("@tanstack/react-query");
const createClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Le nom de classe est requis'),
    level: zod_1.z.string().min(1, 'Le niveau de classe est requis'),
    section: zod_1.z.string().optional(),
    supervisorId: zod_1.z.string().optional(),
});
function CreateClassForm({ onSuccess, editDefaultValues, }) {
    const { currentSchool } = (0, ui_1.useUserStore)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { handleSubmit, register, control, formState: { errors, isSubmitting, isDirty }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_2.zodResolver)(createClassSchema),
        mode: 'onBlur',
        defaultValues: {
            name: editDefaultValues?.name || '',
            level: editDefaultValues?.level || '',
            section: editDefaultValues?.section || '',
            supervisorId: editDefaultValues?.supervisor?.id || '',
        },
    });
    const { data: teachersData, isLoading: isLoadingTeachers } = (0, ui_1.useGetTeacherOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const { mutateAsync: createMutate } = (0, ui_1.useCreateClassMutation)({
        onMutate: async (variables, context) => {
            await queryClient.cancelQueries({ queryKey: ['GetSchoolClasses'] });
            const previous = queryClient.getQueryData(['GetSchoolClasses']);
        },
        onSuccess: async (data, variables, onMutateResult, context) => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
        },
    });
    const { mutateAsync: updateMutate } = (0, ui_1.useUpdateClassMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
        },
    });
    const onSubmit = async (data) => {
        const isEdit = !!editDefaultValues;
        const promise = isEdit
            ? updateMutate({
                classId: editDefaultValues.id,
                data,
                schoolId: currentSchool?.id,
            })
            : createMutate({
                data,
            });
        sonner_1.toast.promise(promise, {
            loading: isEdit ? 'Mise à jour en cours...' : 'Création en cours...',
            success: (res) => {
                return isEdit
                    ? 'Mise à jour réussie avec succès'
                    : 'Création réussie avec succès';
            },
            error: (error) => error.message || "Erreur lors de l'opération",
            toasterId: 'dashboard',
        });
        if (onSuccess)
            onSuccess();
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="class_name">Nom de la classe</field_1.FieldLabel>
          <input_1.Input {...register('name')} autoComplete="off" id="class_name" placeholder="Ex: 6ème A" aria-invalid={!!errors.name}/>
          <field_1.FieldError>{errors?.name?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="level">Niveau</field_1.FieldLabel>
          <input_1.Input {...register('level')} id="level" placeholder="Ex: 6ème" aria-invalid={!!errors.level}/>
          <field_1.FieldError>{errors?.level?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>

      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="section">Section (Optionnel)</field_1.FieldLabel>
          <input_1.Input {...register('section')} id="section" placeholder="Ex: Science" aria-invalid={!!errors.section}/>
          <field_1.FieldError>{errors?.section?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="supervisorId">Professeur principal</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="supervisorId" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={onChange} value={value} disabled={isLoadingTeachers} defaultValue={editDefaultValues?.supervisor?.id}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder={isLoadingTeachers
                ? 'Chargement...'
                : 'Sélectionner un professeur'}>
                    {editDefaultValues &&
                `${editDefaultValues?.supervisor?.profile?.lastname} ${editDefaultValues?.supervisor?.profile?.firstname}`}
                  </select_1.SelectValue>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {teachersData?.getSchoolTeachers?.data?.map((teacher) => (<select_1.SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.user?.profile?.firstname}{' '}
                      {teacher.user?.profile?.lastname}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>
          <field_1.FieldError>{errors?.supervisorId?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>

      <div className="flex justify-end pt-4">
        <submit_button_1.SubmitButton disabled={!isDirty || isSubmitting} isSubmitting={isSubmitting}>
          {editDefaultValues ? 'Mettre à jour' : 'Créer la classe'}
        </submit_button_1.SubmitButton>
      </div>
    </form>);
}
//# sourceMappingURL=create-class-form.js.map