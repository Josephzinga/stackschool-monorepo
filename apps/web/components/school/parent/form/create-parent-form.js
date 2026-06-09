'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateParentForm = CreateParentForm;
const react_hook_form_1 = require("react-hook-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const zod_1 = require("@hookform/resolvers/zod");
const shared_1 = require("@stackschool/shared");
const grid_form_1 = require("@/components/school/grid-form");
const profile_sub_form_1 = require("@/components/school/form/profile-sub-form");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const button_1 = require("@/components/animate-ui/components/buttons/button");
const react_1 = require("react");
const useDebounce_1 = require("@/hooks/useDebounce");
const command_1 = require("@/components/ui/command");
function CreateParentForm({ initialValues, }) {
    const { currentSchool } = (0, ui_1.useUserStore)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [open, setOpen] = (0, react_1.useState)(false);
    const debouncedSearch = (0, useDebounce_1.useDebounce)(searchTerm, 500);
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(shared_1.createParentSchema),
        defaultValues: {
            firstname: initialValues?.firstname,
            lastname: initialValues?.lastname,
            email: initialValues?.email,
            phoneNumber: initialValues?.phoneNumber,
            address: initialValues?.address,
            profession: initialValues?.profession,
            children: initialValues?.children,
        },
    });
    const { register, control, handleSubmit, formState: { errors }, } = methods;
    const { fields, append, replace, insert } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: 'children',
    });
    const isEdit = !!initialValues;
    const { data, isPending } = (0, ui_1.useSearchStudentQuery)({
        input: {
            schoolId: currentSchool?.id,
            searchTerm: debouncedSearch?.trim(),
            limit: 10,
        },
    }, {
        enabled: !!currentSchool?.id,
    });
    const filteredStudents = (0, react_1.useMemo)(() => data?.searchStudent
        ?.filter((s) => fields.some((f) => f.id !== s.id))
        .filter(Boolean), []);
    const { mutateAsync: createMutate, isError, error, } = (0, ui_1.useCreateParentMutation)();
    const onSubmit = async (data) => {
        const promise = createMutate({
            input: data,
        });
        sonner_1.toast.promise(promise, {
            loading: isEdit ? 'Modification en cours... ' : 'Creation en cours...',
            success: 'Parent crée avec succès',
            error: (err) => {
                return err?.message || 'Erreur lors de la création du parent';
            },
        });
    };
    console.log('SearchTErm', searchTerm);
    return (<react_hook_form_1.FormProvider {...methods}>
      <form onSubmit={(handleSubmit(onSubmit),
            (err) => {
                console.log(err);
            })} className="flex flex-col gap-4 w-full">
        <profile_sub_form_1.ProfileSubForm />
        <grid_form_1.GridForm>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="profession">Profession</field_1.FieldLabel>
            <input_1.Input id="profession" {...register('profession')} placeholder="Électricien" aria-invalid={!!errors.profession}/>
            <field_1.FieldError errors={[{ message: errors.profession?.message }]}/>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel htmlFor="address">Address</field_1.FieldLabel>
            <input_1.Input {...register('address')} placeholder="ACI 200 Bamako, Mali" aria-invalid={!!errors.address}/>
            <field_1.FieldError errors={[{ message: errors.address?.message }]}/>
          </field_1.Field>
        </grid_form_1.GridForm>

        <button_1.Button onClick={() => setOpen(!open)} type="button" variant="outline" className="border-dashed! cursor-pointer">
          Ajouter des élève
        </button_1.Button>

        <div className="flex flex-row justify-end">
          <button_1.Button type="submit" className="cursor-pointer md:px-6">
            {isEdit ? 'Modifier' : 'Créer'}
          </button_1.Button>
        </div>

        <command_1.CommandDialog open={open} onOpenChange={setOpen}>
          <command_1.Command shouldFilter={false}>
            <command_1.CommandInput onValueChange={setSearchTerm}/>
            <command_1.CommandList>
              <command_1.CommandEmpty>Aucun élève trouvé</command_1.CommandEmpty>
              {data?.searchStudent?.map((student) => (<command_1.CommandItem value={student.id} key={student.id}>
                  {student.user?.profile?.firstname}{' '}
                  {student.user?.profile?.lastname}
                </command_1.CommandItem>))}
            </command_1.CommandList>
          </command_1.Command>
        </command_1.CommandDialog>
      </form>
    </react_hook_form_1.FormProvider>);
}
//# sourceMappingURL=create-parent-form.js.map