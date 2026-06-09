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
exports.TeacherAssignmentForm = void 0;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const combobox_1 = require("@/components/ui/combobox");
const ui_1 = require("@stackschool/ui");
const field_1 = require("@/components/ui/field");
const button_1 = require("@/components/ui/button");
const button_2 = require("@/components/animate-ui/components/buttons/button");
const grid_form_1 = require("@/components/school/grid-form");
const sonner_1 = require("sonner");
const shared_1 = require("@stackschool/shared");
const react_query_1 = require("@tanstack/react-query");
const app_alert_dialog_1 = require("@/components/app-alert-dialog");
const TeacherAssignmentForm = ({ initialValues, onSuccess, onCancel, }) => {
    const { handleSubmit, control, formState: { errors, isDirty }, watch, setValue, getValues, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(shared_1.teacherAssignmentSchema),
        defaultValues: {
            teacherId: initialValues?.teacherId || '',
            classId: initialValues?.classId || '',
            subjectIds: initialValues?.assignments?.map((ass) => ass.subjectId) || [],
        },
    });
    const [assignmentToDelete, setAssignmentToDelete] = (0, react_1.useState)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const selectedClassId = watch('classId');
    const isClassFixed = !!initialValues?.classId;
    const isEdit = !!initialValues?.teacherId;
    const queryClient = (0, react_query_1.useQueryClient)();
    const invalidateQueries = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['GetClassSubjectTable'],
        });
        await queryClient.invalidateQueries({
            queryKey: ['getTeachersTeam'],
        });
        await queryClient.invalidateQueries({
            queryKey: ['GetClassSubjectsOption'],
        });
        onSuccess?.();
    };
    const { data: teachersData } = (0, ui_1.useGetTeacherOptionsQuery)({
        input: { limit: 100 },
    });
    const { data: classesData } = (0, ui_1.useGetClassesOptionsQuery)({ input: { limit: 100 } }, { enabled: !isClassFixed });
    const { data: classSubjects, isLoading: subjectsLoading } = (0, ui_1.useGetClassSubjectsOptionQuery)({ classId: selectedClassId || initialValues?.classId || '' }, { enabled: !!(selectedClassId || initialValues?.classId) });
    const anchor = (0, combobox_1.useComboboxAnchor)();
    const { mutateAsync: createMutate } = (0, ui_1.useCreateTeacherAssignmentMutation)({
        onSuccess: async () => {
            await invalidateQueries();
        },
    });
    const { mutateAsync: syncMutation } = (0, ui_1.useSyncTeacherAssignmentMutation)({
        onSuccess: async () => {
            await invalidateQueries();
        },
    });
    const classes = classesData?.getSchoolClasses?.data || [];
    const teachers = teachersData?.getSchoolTeachers?.data.map((t) => ({
        id: t.id,
        name: `${t.user?.profile?.firstname}  ${t?.user?.profile?.lastname}`,
    })) || [];
    const subjects = classSubjects?.getClassSubjects
        ?.filter((cls) => !initialValues?.teacherId
        ? !cls.assignment
        : initialValues.assignments?.some((ass) => ass.subjectId === cls.subject.id) || !cls.assignment)
        .map((cs) => ({
        id: cs.subject.id,
        name: cs.subject.name,
        code: cs.subject.code,
    })) || [];
    const subjectIds = watch('subjectIds');
    (0, react_1.useEffect)(() => {
        if (initialValues?.assignments?.length) {
            const toDelete = initialValues.assignments
                .filter((ass) => !subjectIds.includes(ass.subjectId))
                .map((ass) => subjects?.find((sub) => ass.subjectId === sub.id))
                .filter(Boolean);
            setAssignmentToDelete(toDelete);
        }
    }, [subjectIds]);
    const onSubmit = async (data) => {
        if (isEdit && assignmentToDelete && assignmentToDelete.length > 0) {
            setOpen(true);
            return;
        }
        else if (!!initialValues?.teacherId) {
            executeSync(data.subjectIds);
            return;
        }
        const promise = createMutate({
            input: data,
        });
        sonner_1.toast.promise(promise, {
            loading: "Création le l' assignation en cours...",
            success: 'Création réussie avec succès.',
            error: (err) => {
                return err?.message || "Erreur lors de la création l' assignation ";
            },
        });
    };
    const executeSync = (ids) => {
        const promise = syncMutation({
            input: {
                teacherId: initialValues?.teacherId || getValues('teacherId'),
                classId: initialValues?.classId || getValues('classId'),
                subjectIds: ids,
            },
        });
        sonner_1.toast.promise(promise, {
            loading: 'Synchronisation en cours...',
            success: 'Modifications enregistrées !',
            error: (err) => err?.message || 'Erreur de synchro',
        });
    };
    const onConfirmDelete = () => {
        executeSync(watch('subjectIds'));
        setOpen(false);
    };
    const handleCancel = () => {
        setValue('subjectIds', initialValues?.assignments?.map((ass) => ass.subjectId));
    };
    return (<div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <grid_form_1.GridForm>
          <field_1.Field>
            <field_1.FieldLabel>Enseignant</field_1.FieldLabel>
            <react_hook_form_1.Controller control={control} name="teacherId" render={({ field }) => (<combobox_1.Combobox items={teachers} disabled={!!initialValues?.teacherId} value={field.value} onValueChange={field.onChange} itemToStringLabel={(itemValue) => teachers.find((t) => t.id === itemValue)?.name || ''}>
                  <combobox_1.ComboboxInput aria-invalid={!!errors.teacherId} disabled={!!initialValues?.teacherId} showClear placeholder="Sélectionner un enseignant"/>
                  <combobox_1.ComboboxContent className="z-50">
                    <combobox_1.ComboboxEmpty>Aucun enseignant trouvé</combobox_1.ComboboxEmpty>
                    <combobox_1.ComboboxList>
                      {(item) => (<combobox_1.ComboboxItem key={item.id} value={item.id}>
                          {item.name}
                        </combobox_1.ComboboxItem>)}
                    </combobox_1.ComboboxList>
                  </combobox_1.ComboboxContent>
                </combobox_1.Combobox>)}/>
            <field_1.FieldError>{errors.teacherId?.message}</field_1.FieldError>
          </field_1.Field>

          
          {!isClassFixed && (<field_1.Field>
              <field_1.FieldLabel>Classe</field_1.FieldLabel>
              <react_hook_form_1.Controller control={control} name="classId" render={({ field }) => (<combobox_1.Combobox items={classes} value={field.value} onValueChange={(val) => {
                    field.onChange(val);
                    setValue('subjectIds', []);
                }} itemToStringLabel={(itemValue) => {
                    const cls = classes.find((c) => c.id === itemValue);
                    return cls?.name || '';
                }}>
                    <combobox_1.ComboboxInput aria-invalid={!!errors.classId} showClear placeholder="Sélectionner une classe"/>
                    <combobox_1.ComboboxContent>
                      <combobox_1.ComboboxEmpty>Aucune classe trouvée</combobox_1.ComboboxEmpty>
                      <combobox_1.ComboboxList>
                        {(item) => (<combobox_1.ComboboxItem key={item.id} value={item.id}>
                            {item.name} {item.level ? `(${item.level})` : ''}
                          </combobox_1.ComboboxItem>)}
                      </combobox_1.ComboboxList>
                    </combobox_1.ComboboxContent>
                  </combobox_1.Combobox>)}/>
              <field_1.FieldError>{errors.classId?.message}</field_1.FieldError>
            </field_1.Field>)}

          
          <field_1.Field>
            <field_1.FieldLabel>Matières</field_1.FieldLabel>
            <react_hook_form_1.Controller control={control} name="subjectIds" render={({ field }) => (<combobox_1.Combobox multiple autoHighlight items={subjects} value={field.value} onValueChange={field.onChange} itemToStringValue={(item) => item} disabled={subjectsLoading ||
                (!selectedClassId && !initialValues?.classId)}>
                  <combobox_1.ComboboxChips ref={anchor} className="w-full">
                    <combobox_1.ComboboxValue>
                      {(values) => (<>
                          {values.map((value) => {
                    const sub = subjects.find((s) => s.id === value);
                    return sub ? (<combobox_1.ComboboxChip key={value}>
                                {sub.name}
                              </combobox_1.ComboboxChip>) : null;
                })}
                          <combobox_1.ComboboxChipsInput aria-invalid={!!errors.subjectIds} placeholder={values.length === 0
                    ? subjectsLoading
                        ? 'Chargement...'
                        : 'Sélectionner des matières'
                    : ''}/>
                        </>)}
                    </combobox_1.ComboboxValue>
                  </combobox_1.ComboboxChips>
                  <combobox_1.ComboboxContent anchor={anchor}>
                    <combobox_1.ComboboxEmpty>
                      {subjectsLoading
                ? 'Chargement...'
                : `Aucune matière ${subjects.length === 0 && 'libre'} disponible pour cette classe`}
                    </combobox_1.ComboboxEmpty>
                    <combobox_1.ComboboxList>
                      {(item) => (<combobox_1.ComboboxItem key={item.id} value={item.id}>
                          {item.name} {item.code && `(${item.code})`}
                        </combobox_1.ComboboxItem>)}
                    </combobox_1.ComboboxList>
                  </combobox_1.ComboboxContent>
                </combobox_1.Combobox>)}/>
            <field_1.FieldError>{errors.subjectIds?.message}</field_1.FieldError>
          </field_1.Field>
        </grid_form_1.GridForm>

        <div className="flex justify-end gap-2 md:gap-4 pt-2">
          {onCancel && (<button_1.Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </button_1.Button>)}
          {initialValues?.teacherId && (<button_2.Button onClick={() => {
                setValue('subjectIds', ['']);
                setOpen(true);
            }} type="button" variant="destructive">
              Supprimer
            </button_2.Button>)}
          <button_2.Button disabled={!isDirty}>
            {initialValues?.teacherId ? 'Modifier' : 'Assigner'}
          </button_2.Button>
        </div>
      </form>
      <app_alert_dialog_1.AppAlertDialog open={open} onOpenChange={setOpen} onCancel={handleCancel} title="Etes-vous sur ?" description={`voulez vous vraiment supprimer La
        ${assignmentToDelete?.map((ass) => ass?.name)} pour 
        ${teachers.find((t) => t.id === initialValues?.teacherId)?.name}
        dans cette classe?   tous les lesson et autre donnée relié seront effacer`} onConfirm={onConfirmDelete}/>
    </div>);
};
exports.TeacherAssignmentForm = TeacherAssignmentForm;
//# sourceMappingURL=assignment-form.js.map