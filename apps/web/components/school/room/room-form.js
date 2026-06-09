'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomForm = RoomForm;
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const grid_form_1 = require("@/components/school/grid-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const ui_1 = require("@stackschool/ui");
const button_1 = require("@/components/ui/button");
const sonner_1 = require("sonner");
const react_query_1 = require("@tanstack/react-query");
const shared_1 = require("@stackschool/shared");
const utils_1 = require("@/lib/utils");
function RoomForm({ onSucces, initialValues, }) {
    const { handleSubmit, control, register, formState: { errors, isDirty, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(shared_1.createRoomSchema),
        mode: 'onBlur',
        defaultValues: {
            id: initialValues?.id,
            name: initialValues?.name || '',
            code: initialValues?.code || '',
            defaultClassId: initialValues?.defaultClassId || '',
            type: initialValues?.type || 'CLASSIC',
            capacity: initialValues?.capacity || 0,
        },
    });
    const isEdit = !!initialValues;
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const { mutateAsync: createMutate } = (0, ui_1.useCreateRoomMutation)({
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolRoom'] });
        },
        onSuccess: async (data) => {
            onSucces?.();
        },
    });
    const { mutateAsync: updateMutate } = (0, ui_1.useUpdateRoomMutation)({
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolRoom'] });
        },
        onSuccess: async (data) => {
            onSucces?.();
        },
    });
    const onSubmit = async (data) => {
        const promise = isEdit
            ? updateMutate({
                input: {
                    ...data,
                    id: initialValues?.id,
                },
            })
            : createMutate({
                input: data,
            });
        sonner_1.toast.promise(promise, {
            loading: isEdit ? 'Mise à jour en cours...' : 'Création en cours...',
            success: (data) => {
                return isEdit
                    ? `La salle ${data?.updateRoom?.name} à été modifier avec succès.`
                    : `La salle ${data?.createRoom?.name} à été crée avec succès.`;
            },
            error: (err) => {
                return err?.message || isEdit
                    ? 'Erreur lors de la misse à jour de la salle'
                    : 'Erreur lors de la création de la salle';
            },
            toasterId: 'dashboard',
        });
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 md:gap-4">
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="name">Nom</field_1.FieldLabel>
          <input_1.Input id="name" {...register('name')} placeholder="Sale d'informatique"/>
          <field_1.FieldError>{errors.name?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="code">Code/N°</field_1.FieldLabel>
          <input_1.Input id="code" {...register('code')} placeholder="10"/>
        </field_1.Field>
      </grid_form_1.GridForm>
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="capacity">Places</field_1.FieldLabel>
          <input_1.Input type="number" id="capacity" placeholder="30" {...register('capacity')}/>
          <field_1.FieldError>{errors.capacity?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel htmlFor="type">Type</field_1.FieldLabel>
          <input_1.Input id="type" {...register('type')} placeholder="Labo"/>
          <field_1.FieldError>{errors.type?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
      <field_1.Field>
        <field_1.FieldLabel>Classe occupé</field_1.FieldLabel>
        <react_hook_form_1.Controller control={control} name="defaultClassId" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={onChange} value={value}>
              <select_1.SelectTrigger>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {data?.getSchoolClasses.data?.map((cls) => (<select_1.SelectItem value={cls?.id} key={cls?.id}>
                    {cls?.name} ({cls?.level})
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>)}/>
      </field_1.Field>
      <div className="flex justify-end">
        <button_1.Button type="submit" disabled={!isDirty && isSubmitting} className={(0, utils_1.cn)('font-semibold', isSubmitting && 'cursor-not-allowed')}>
          {isEdit ? 'Modifier la salle' : '  Crée la salle'}
        </button_1.Button>
      </div>
    </form>);
}
//# sourceMappingURL=room-form.js.map