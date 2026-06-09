'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClassSubjectForm = CreateClassSubjectForm;
const select_1 = require("@/components/ui/select");
const react_1 = __importStar(require("react"));
const ui_1 = require("@stackschool/ui");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const field_1 = require("@/components/ui/field");
const button_1 = require("@/components/ui/button");
const sonner_1 = require("sonner");
const input_1 = require("@/components/ui/input");
const grid_form_1 = require("@/components/school/grid-form");
const shared_1 = require("@stackschool/shared");
const react_query_1 = require("@tanstack/react-query");
const combobox_1 = require("@/components/ui/combobox");
const utils_1 = require("@/lib/utils");
function CreateClassSubjectForm({ classId, initialValues, onSuccess, }) {
    const isEdit = !!initialValues?.id;
    const { handleSubmit, control, setError, clearErrors, register, formState: { errors, isDirty }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(shared_1.createClassSubjectSchema),
        mode: 'onBlur',
        defaultValues: {
            id: initialValues?.id ?? '',
            classId: initialValues?.classId || classId,
            coefficient: initialValues?.coefficient || 1,
            weeklyHours: initialValues?.weeklyHours || 2,
            subjectId: initialValues?.subjectId ?? '',
            teacherId: initialValues?.teacherId ?? '',
        },
    });
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: teachersData } = (0, ui_1.useGetTeacherOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const { data: schoolSubjects } = (0, ui_1.useGetSubjectsOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const teachers = teachersData?.getSchoolTeachers?.data.map((t) => ({
        id: t.id,
        firstname: t.user?.profile?.firstname,
        lastname: t.user?.profile?.lastname,
    })) || [];
    const queryKey = ['GetClassSubjectTable', { classId }];
    const tableData = queryClient.getQueryData(queryKey);
    const filteredSubject = (0, react_1.useMemo)(() => schoolSubjects?.getSchoolSubjects?.data?.filter((sub) => !tableData?.class?.group?.classSubjects?.some((cls) => cls?.subject?.id === sub.id)), [schoolSubjects, tableData, isEdit]);
    (0, react_1.useEffect)(() => {
        if (filteredSubject && filteredSubject.length <= 0) {
            setError('subjectId', {
                message: "Tous les matière de l'établissements sont déjà assigné dans cette classe.",
            });
        }
        else {
            clearErrors('subjectId');
        }
    }, []);
    const { mutateAsync: createMutate } = (0, ui_1.useCreateClassSubjectMutation)({
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey });
            const teachersList = queryClient.getQueryData([
                'GetSubjectsOptions',
                { input: { limit: 100 } },
            ]);
            const subjectsList = queryClient.getQueryData([
                'GetSubjectsOptions',
                { input: { limit: 100 } },
            ]);
            const selectedTeacher = teachersList?.getSchoolTeachers?.data?.find((t) => t.id === variables.input?.teacherId);
            const selectedSubject = subjectsList?.getSchoolSubjects?.data?.find((s) => s.id === variables.input?.subjectId);
            const optimistic = {
                id: `temp-${Date.now()}`,
                coefficient: variables.input?.coefficient,
                weeklyHours: variables.input?.weeklyHours,
                subject: {
                    id: variables.input?.subjectId,
                    name: selectedSubject?.name || 'Matière...',
                    code: selectedSubject?.code,
                },
                teacher: {
                    id: variables.input?.teacherId,
                    user: {
                        profile: {
                            firstname: selectedTeacher?.user?.profile?.firstname,
                            lastname: selectedTeacher?.user?.profile?.lastname,
                        },
                    },
                },
            };
            queryClient.setQueryData(queryKey, (old) => {
                if (!old)
                    return old;
                return {
                    ...old,
                    class: {
                        ...old.class,
                        classSubject: [
                            ...(old.class?.group?.classSubjects || []),
                            optimistic,
                        ],
                    },
                };
            });
            return { previous: tableData, queryKey };
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(context.queryKey, (old) => ({
                ...old,
                class: {
                    ...old?.class,
                    classSubject: old?.class?.group?.classSubjects?.map((cls) => cls?.id.startsWith('temp-') ? data?.createClassSubject : cls),
                },
            }));
            onSuccess?.();
        },
        onError: (_, __, context) => {
            if (context?.previous) {
                queryClient.setQueryData(context.queryKey, context.previous);
            }
        },
        onSettled: async (_, __, ___, context) => {
            await queryClient.invalidateQueries({ queryKey: context?.queryKey });
        },
    });
    const { mutateAsync: updateMutate } = (0, ui_1.useUpdateClassSubjectMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['GetClassSubjectTable', 'getTeachersTeam'],
            });
            onSuccess?.();
        },
    });
    const onSubmit = async (data) => {
        const promise = isEdit
            ? updateMutate({
                input: data,
            })
            : createMutate({
                input: data,
            });
        console.log('DAta', data);
        sonner_1.toast.promise(promise, {
            loading: isEdit ? 'Modification en cours...' : 'Ajout en cours...',
            success: (data) => {
                return isEdit
                    ? `Modification reussi avec succès`
                    : `Matière ajouter avec succès`;
            },
            error: (err) => {
                return (err?.message ||
                    (isEdit
                        ? 'Erreur lors de la modification.'
                        : 'Erreur lors de la création'));
            },
            toasterId: 'dashboard',
        });
    };
    return (<form onSubmit={handleSubmit(onSubmit, (err) => {
            console.log('Erreur', err);
        })} className="flex flex-col gap-2">
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel>Enseignant</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="teacherId" render={({ field }) => (<combobox_1.Combobox items={teachers} disabled={!!initialValues?.teacherId} value={field.value} onValueChange={field.onChange} itemToStringLabel={(itemValue) => {
                const teacher = teachers.find((t) => t.id === itemValue);
                return teacher
                    ? `${teacher.firstname} ${teacher.lastname}`
                    : '';
            }}>
                <combobox_1.ComboboxInput aria-invalid={!!errors.teacherId} disabled={!!initialValues?.teacherId} showClear placeholder="Sélectionner un enseignant" className={(0, utils_1.cn)('h-10!', !!initialValues?.teacherId && 'hover:cursor-not-allowed')}/>
                <combobox_1.ComboboxContent className="z-50">
                  <combobox_1.ComboboxEmpty>Aucun enseignant trouvé</combobox_1.ComboboxEmpty>
                  <combobox_1.ComboboxList>
                    {(item) => (<combobox_1.ComboboxItem key={item.id} value={item.id}>
                        {item.firstname} {item.lastname}
                      </combobox_1.ComboboxItem>)}
                  </combobox_1.ComboboxList>
                </combobox_1.ComboboxContent>
              </combobox_1.Combobox>)}/>
          <field_1.FieldError>{errors.teacherId?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Matière</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="subjectId" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={onChange} value={value}>
                <select_1.SelectTrigger disabled={isEdit} className="h-10!">
                  <select_1.SelectValue placeholder="Selectionner la matière"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {filteredSubject?.map((subject) => (<select_1.SelectItem value={subject?.id}>
                      <span className="text-sm font-poppins">
                        {subject?.name}{' '}
                        <span className="text-gray-600">{subject?.code}</span>
                      </span>
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>

          <field_1.FieldError>{errors.subjectId?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
      <grid_form_1.GridForm>
        <field_1.Field>
          <field_1.FieldLabel>Coéfficient</field_1.FieldLabel>
          <input_1.Input type="number" {...register('coefficient')} aria-invalid={!!errors.coefficient}/>
          <field_1.FieldError>{errors.coefficient?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Heures par semaine</field_1.FieldLabel>

          <input_1.Input type="number" {...register('weeklyHours')} aria-invalid={!!errors.weeklyHours}/>
          <field_1.FieldError>{errors?.weeklyHours?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
      <div className="w-full flex justify-end mt-4">
        <button_1.Button disabled={!isDirty} type="submit">
          {isEdit ? 'Modifier' : 'Ajouter'}
        </button_1.Button>
      </div>
    </form>);
}
//# sourceMappingURL=create-classSubject-form.js.map