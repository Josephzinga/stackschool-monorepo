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
exports.default = SubjectForm;
const grid_form_1 = require("../grid-form");
const field_1 = require("@/components/ui/field");
const input_1 = require("@/components/ui/input");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const select_1 = require("@/components/ui/select");
const react_1 = __importStar(require("react"));
const ui_1 = require("@stackschool/ui");
const scroll_area_1 = require("@/components/ui/scroll-area");
const dialog_1 = require("@/components/ui/dialog");
const button_1 = require("@/components/ui/button");
const checkbox_1 = require("@/components/ui/checkbox");
const label_1 = require("@/components/ui/label");
const sonner_1 = require("sonner");
const lucide_react_1 = require("lucide-react");
const react_query_1 = require("@tanstack/react-query");
const shared_1 = require("@stackschool/shared");
const constant_1 = require("@/constant");
function SubjectForm({ initialValues, onSuccess, }) {
    const { handleSubmit, register, control, formState: { errors, isLoading, isDirty }, } = (0, react_hook_form_1.useForm)({ resolver: (0, zod_1.zodResolver)(shared_1.createSubjectForm) });
    const [openDialog, setOpenDialog] = (0, react_1.useState)(false);
    const [tempClass, setTempClass] = (0, react_1.useState)([]);
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: classesData } = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const { data: teacherData } = (0, ui_1.useGetTeacherOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const teachers = teacherData?.getSchoolTeachers.data;
    const classes = classesData?.getSchoolClasses.data;
    const { mutateAsync } = (0, ui_1.useCreateSubjectMutation)({
        onMutate: async (newSubject) => {
            await queryClient.cancelQueries({ queryKey: ['GetSchoolSubjects'] });
            const previous = await queryClient.getQueryData(['GetSchoolSubjects']);
            const optimisticObject = {
                ...newSubject.input,
                id: `temp-${Date.now()}`,
                classSubject: [],
                isOptimistic: true,
            };
            queryClient.setQueryData(['GetSchoolSubjects'], (old) => ({
                ...old,
                getSchoolSubjects: {
                    data: [old?.getSchoolSubjects?.data || [], optimisticObject],
                },
            }));
            return { previous, tempId: optimisticObject.id };
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(['GetSchoolSubjects'], (old) => ({
                ...old,
                getSchoolSubjects: {
                    data: old?.getSchoolSubjects?.data?.map((s) => s?.id === context.tempId ? data.createSubject : s),
                },
            }));
        },
        onError: async (error, _, context) => {
            await queryClient.setQueryData(['GetSchoolSubjects'], context?.previous);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolSubjects'] });
        },
    });
    const onSubmit = async (data) => {
        const promise = mutateAsync({
            input: data,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Création en cours...',
            success: (data) => {
                return `${data?.createSubject?.name} crée avec succès.`;
            },
            error: (err) => {
                return err?.message || 'Erreur lors de la création de la matière.';
            },
            toasterId: 'dashboard',
        });
        if (onSuccess)
            onSuccess();
    };
    const { fields, append, remove } = (0, react_hook_form_1.useFieldArray)({
        control: control,
        name: 'classSubject',
    });
    const toggleSubject = (classId) => {
        setTempClass((prev) => prev?.includes(classId)
            ? prev?.filter((id) => id !== classId)
            : [...prev, classId]);
    };
    function handleConfirm() {
        if (tempClass.length === 0) {
            sonner_1.toast.error('Veuillez sélectionner au moins une classe.', {
                toasterId: 'dashboard',
            });
            return;
        }
        const currentClassIds = fields.map((f) => f.classId);
        for (let i = fields.length - 1; i >= 0; i--) {
            if (!tempClass.includes(fields[i].classId)) {
                remove(i);
            }
        }
        const newClassesToAdd = tempClass.filter((id) => !currentClassIds.includes(id));
        newClassesToAdd.forEach((classId) => {
            append({
                classId: classId,
                coefficient: 1,
                weeklyHours: 2,
            });
        });
        setOpenDialog(false);
    }
    return (<div className="flex-1">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <grid_form_1.GridForm>
          <field_1.Field>
            <field_1.FieldLabel>Nom</field_1.FieldLabel>
            <input_1.Input {...register('name')} aria-invalid={!!errors.name} placeholder="Mathématique"/>
            <field_1.FieldError>{errors.name?.message}</field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel>Code</field_1.FieldLabel>
            <input_1.Input {...register('code')} aria-invalid={!!errors.code} placeholder="MATH"/>
            <field_1.FieldError>{errors.code?.message}</field_1.FieldError>
          </field_1.Field>
        </grid_form_1.GridForm>
        <grid_form_1.GridForm>
          <field_1.Field>
            <field_1.FieldLabel>Professeur Principal</field_1.FieldLabel>
            <react_hook_form_1.Controller control={control} name="mainTeacherId" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={onChange} value={value}>
                  <select_1.SelectTrigger aria-invalid={!!errors.mainTeacherId} className="h-10!">
                    <select_1.SelectValue placeholder="Selectionner le Professeur Principal"></select_1.SelectValue>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {teachers?.map((teacher) => (<select_1.SelectItem key={teacher?.id} value={teacher?.id}>
                        <div className="flex flex-col">
                          <span className="text-sm font-inter font-medium">
                            {teacher?.user?.profile?.lastname}
                          </span>
                          <span className="text-[10px] opacity-80 font-poppins">
                            {teacher?.user?.profile?.firstname}
                          </span>
                        </div>
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>)}/>
            <field_1.FieldError> {errors.mainTeacherId?.message}</field_1.FieldError>
          </field_1.Field>
          <field_1.Field>
            <field_1.FieldLabel>Category</field_1.FieldLabel>
            <react_hook_form_1.Controller control={control} name="category" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={onChange} value={value}>
                  <select_1.SelectTrigger aria-invalid={!!errors.category} className="h-10!">
                    <select_1.SelectValue placeholder="Selectionner une Categorie"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {constant_1.categoryMap.map((c) => (<select_1.SelectItem value={c.value}>{c.label}</select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>)}/>
            <field_1.FieldError className="text-[10px] font-inter">
              {errors.category?.message}
            </field_1.FieldError>
          </field_1.Field>
        </grid_form_1.GridForm>
        {fields.length > 0 && (<div className="flex flex-col gap-3 mt-4">
            <h3 className="text-sm font-medium font-poppins text-muted-foreground">
              Configuration par classe
            </h3>
            {fields?.map((field, index) => {
                const cls = classes?.find((c) => c?.id === field.classId);
                return (<div key={field.id} className="flex items-center gap-4 py-1 px-2 border rounded-lg bg-accent/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium font-poppins">
                      {cls?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({cls?.level})
                    </p>
                  </div>

                  <div className="w-20 space-y-1">
                    <field_1.FieldLabel className="text-xs">Coeff.</field_1.FieldLabel>
                    <react_hook_form_1.Controller control={control} name={`classSubject.${index}.coefficient`} render={({ field: { onChange, value } }) => (<input_1.Input type="number" min="1" className="h-8! text-sm" aria-invalid={!!errors.classSubject?.[index]?.coefficient} onChange={(event) => onChange(Number(event.target.value))}/>)}/>
                    <field_1.FieldError>
                      {errors.classSubject?.[index]?.coefficient?.message}
                    </field_1.FieldError>
                  </div>

                  <div className="w-20 space-y-1">
                    <field_1.FieldLabel className="text-xs">Heures</field_1.FieldLabel>
                    <react_hook_form_1.Controller control={control} name={`classSubject.${index}.weeklyHours`} render={({ field: { onChange, value } }) => (<input_1.Input type="number" min="1" className="h-8! text-sm" aria-invalid={!!errors.classSubject?.[index]?.weeklyHours} value={value} onChange={(event) => onChange(Number(event.target.value))}/>)}/>
                    <field_1.FieldError className="text-[8px]!">
                      {errors.classSubject?.[index]?.weeklyHours?.message}
                    </field_1.FieldError>
                  </div>

                  <button_1.Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive/70 cursor-pointer hover:bg-destructive/10 mt-5" onClick={() => {
                        remove(index);
                        setTempClass((prev) => prev.filter((id) => id !== field.classId));
                    }}>
                    <lucide_react_1.Trash2 className="h-4 w-4"/>
                  </button_1.Button>
                </div>);
            })}
          </div>)}

        <dialog_1.Dialog open={openDialog} onOpenChange={(isOpen) => {
            if (isOpen) {
                setTempClass(fields.map((f) => f.classId));
            }
            setOpenDialog(isOpen);
        }}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button variant="outline" className="text-center p-1! max-w-45 font-poppins font-medium cursor-pointer hover:bg-primary/50 border-2 border-dashed rounded-lg">
              Assigné aux classes
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Selectionner des classes</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                La classe ou la matière sera enseigné
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>

            <scroll_area_1.ScrollArea className="max-h-100">
              {classes?.map((cls) => (<div key={cls?.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md overscroll-y-auto">
                  <checkbox_1.Checkbox id={`${cls?.id}`} checked={tempClass.includes(cls?.id)} onCheckedChange={() => {
                if (cls?.id)
                    toggleSubject(cls.id);
            }} className="cursor-pointer"/>
                  <label_1.Label htmlFor={`${cls?.id}`} className="flex-1 cursor-pointer text-sm font-poppins">
                    {cls?.name}{' '}
                    <span className="text-muted-foreground text-xs">
                      ({cls?.level})
                    </span>
                  </label_1.Label>
                </div>))}
            </scroll_area_1.ScrollArea>
            <dialog_1.DialogFooter>
              <button_1.Button variant="outline" onClick={() => setOpenDialog(false)}>
                Annuler
              </button_1.Button>
              <button_1.Button onClick={handleConfirm} disabled={tempClass.length === 0} className="font-poppins font-medium">
                Ajouter la classe
              </button_1.Button>
            </dialog_1.DialogFooter>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>

        <div className="w-full flex justify-end items-center">
          <button_1.Button type="submit" className="w-50 font-poppins font-semibold">
            Crée la matière
          </button_1.Button>
        </div>
      </form>
    </div>);
}
//# sourceMappingURL=subject-form.js.map