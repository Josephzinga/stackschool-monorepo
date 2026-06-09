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
exports.LessonForm = LessonForm;
const react_1 = __importStar(require("react"));
const grid_form_1 = require("@/components/school/grid-form");
const field_1 = require("@/components/ui/field");
const react_hook_form_1 = require("react-hook-form");
const select_1 = require("@/components/ui/select");
const time_input_1 = require("@/components/time-input");
const button_1 = require("@/components/ui/button");
const shared_1 = require("@stackschool/shared");
const ui_1 = require("@stackschool/ui");
const sonner_1 = require("sonner");
const date_fns_1 = require("date-fns");
const utils_1 = require("@/lib/utils");
const react_query_1 = require("@tanstack/react-query");
const dialog_1 = require("@/components/ui/dialog");
function LessonForm({ initialData, onSuccess, onClose, resourceMode = ui_1.ResourceMode.Class, selectedFilter, resourceId, isClassOnly = false, }) {
    const isUpdate = initialData?.mode === 'UPDATE';
    const eventData = isUpdate ? initialData.args.event : null;
    const selectionData = !isUpdate ? initialData?.args : null;
    const subject = eventData?._def?.extendedProps?.subject;
    const teacher = eventData?._def?.extendedProps?.teacher;
    const lessonId = eventData?._def?.extendedProps.lessonId;
    const lessonStatus = eventData?._def?.extendedProps?.status;
    const isClassMode = resourceMode === 'CLASS';
    const start = eventData ? eventData.start : selectionData?.start;
    const end = eventData ? eventData.end : selectionData?.end;
    const { register, control, handleSubmit, setValue, watch, setError, clearErrors, formState: { errors, isValid, isDirty, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.createLessonSchema),
        defaultValues: {
            startTime: start ? (0, date_fns_1.format)(start, 'HH:mm') : '',
            endTime: end ? (0, date_fns_1.format)(end, 'HH:mm') : '',
            day: (start &&
                Object.keys(shared_1.dayMapping).find((key) => shared_1.dayMapping[key] === (0, date_fns_1.getDay)(start))) || 'MONDAY',
            subjectId: subject?.id || '',
            teacherId: teacher?.id || '',
            classId: isUpdate
                ? eventData?.extendedProps?.group?.id
                : resourceId || '',
            mode: resourceMode,
        },
    });
    const { data: classSubjectData, isPending: isLoadingClassSubjects, isError: isClassSubjectsError, } = (0, ui_1.useGetClassSubjectOptionsQuery)({
        groupId: isClassMode && !isClassOnly ? resourceId : undefined,
        teacherId: !isClassMode ? resourceId : undefined,
        classId: isClassMode && isClassOnly ? resourceId : undefined,
    }, {
        enabled: !!resourceId,
    });
    (0, react_1.useEffect)(() => {
        if (isClassSubjectsError) {
            setError('subjectId', { message: 'Erreur de chargement des matières.' });
            setError('teacherId', {
                message: 'Erreur de chargement des enseignants.',
            });
        }
        else {
            clearErrors('subjectId');
            clearErrors('teacherId');
        }
    }, [isClassSubjectsError, setError, clearErrors]);
    const selectedSubjectId = watch('subjectId');
    const selectedTeacherId = watch('teacherId');
    const selectedClassId = watch('groupId');
    const filteredSubjects = (0, react_1.useMemo)(() => {
        const all = classSubjectData?.getClassSubjects || [];
        if (isClassMode) {
            return all.filter((cs) => isClassOnly
                ? cs.group?.classes?.[0]?.id === resourceId
                : cs?.group?.id === resourceId);
        }
        else {
            return all.filter((cs) => cs?.teacher?.id === resourceId);
        }
    }, [classSubjectData, resourceId, isClassMode]);
    const uniqueSubjects = Array.from(new Map(filteredSubjects?.map((item) => [item.subject?.id, item])).values());
    const filteredSecondary = (0, react_1.useMemo)(() => {
        const all = classSubjectData?.getClassSubjects || [];
        if (isClassMode) {
            return all.filter((cs) => isClassOnly
                ? cs.group?.classes?.[0].id === resourceId
                : cs?.group?.id === resourceId &&
                    (selectedSubjectId ? cs.subject?.id === selectedSubjectId : true));
        }
        else {
            return all.filter((cs) => cs?.teacher?.id === resourceId &&
                (selectedSubjectId ? cs.subject?.id === selectedSubjectId : true));
        }
    }, [classSubjectData, resourceId, isClassMode, selectedSubjectId]);
    const uniqueSecondaryResources = Array.from(new Map(filteredSecondary?.map((item) => [
        isClassMode ? item.teacher?.id : item.group?.id,
        item,
    ])).values());
    const handleSubjectChange = (0, react_1.useCallback)((val, onChange) => {
        onChange(val);
        const matches = filteredSecondary.filter((cs) => cs.subject?.id === val);
        if (matches.length === 1) {
            const targetId = isClassMode
                ? matches[0].teacher?.id
                : matches[0]?.group?.id;
            setValue(isClassMode ? 'teacherId' : 'groupId', targetId);
        }
        else {
            setValue(isClassMode ? 'teacherId' : 'groupId', '');
        }
    }, [filteredSecondary, isClassMode, setValue]);
    const handleSecondaryChange = (0, react_1.useCallback)((val, onChange) => {
        onChange(val);
        const matches = filteredSecondary.filter((cs) => isClassMode ? cs.teacher?.id === val : cs.group?.id === val);
        if (matches.length === 1) {
            setValue('subjectId', matches?.[0]?.subject?.id ?? '');
        }
        else {
            setValue('subjectId', '');
        }
    }, [filteredSecondary, isClassMode, setValue]);
    const queryClient = (0, react_query_1.useQueryClient)();
    const { mutateAsync: deleteMutate } = (0, ui_1.useDeleteLessonMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
            onClose();
            onSuccess();
        },
    });
    const { mutateAsync: updateStatusMutate } = (0, ui_1.useUpdateLessonStatusMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
            onClose();
            onSuccess();
        },
    });
    const { mutateAsync: updateMutate } = (0, ui_1.useUpdateLessonMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
            onClose();
            onSuccess();
        },
    });
    const { mutateAsync: createMutate } = (0, ui_1.useCreateLessonMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
            onClose();
            onSuccess?.();
        },
    });
    const onSubmit = async (data) => {
        const commonData = {
            startTime: data.startTime,
            endTime: data.endTime,
            day: data.day,
            teacherId: data.teacherId,
            groupId: data.groupId,
            subjectId: data.subjectId,
            mode: resourceMode,
        };
        const promise = isUpdate
            ? updateMutate({
                input: { id: lessonId, ...commonData },
            })
            : createMutate({
                input: commonData,
            });
        sonner_1.toast.promise(promise, {
            loading: isUpdate ? 'Modification en cours...' : 'Création en cours...',
            success: (res) => {
                return isUpdate
                    ? 'Modification du leçon réussi avec succès.'
                    : 'Leçon crée avec succès.';
            },
            error: (err) => {
                return (err?.message ||
                    (isUpdate
                        ? 'Erreur lors de la mise à jour de la leçon'
                        : 'Erreur lors de la création de la leçon'));
            },
            toasterId: 'dashboard',
        });
    };
    const handleStatusChange = async (newStatus) => {
        if (!lessonId)
            return;
        const promise = updateStatusMutate({
            status: newStatus,
            id: lessonId,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Mise à jour en cours..',
            success: 'Mise à jour réussie avec succès',
            error: 'Erreur lors de la mise à jour',
            toasterId: 'dashboard',
        });
    };
    const handleDelete = async () => {
        if (!lessonId)
            return;
        const promise = deleteMutate({
            id: lessonId,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: 'Leçon supprimée avec succès.',
            error: (err) => {
                return err?.message || 'Erreur lors de la suppression de leçon.';
            },
            toasterId: 'lesson-form',
        });
    };
    return (<form onSubmit={handleSubmit(onSubmit, (err) => {
            console.log('Erreur', err);
        })} className="flex flex-col gap-4 py-4">
      <grid_form_1.GridForm className="w-full">
        <field_1.Field>
          <field_1.FieldLabel>Matière</field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name="subjectId" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={(val) => handleSubjectChange(val, onChange)} value={value}>
                <select_1.SelectTrigger aria-invalid={!!errors?.subjectId}>
                  <select_1.SelectValue placeholder="Selectionner une maitére"></select_1.SelectValue>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {selectedSubjectId && selectedSubjectId !== '' && (<>
                      <button_1.Button variant="ghost" onClick={() => setValue('subjectId', '')}>
                        Toute les matières
                      </button_1.Button>
                      <select_1.SelectSeparator />
                    </>)}
                  {uniqueSubjects?.map((cls) => (<select_1.SelectItem key={cls?.subject?.id} value={cls?.subject?.id}>
                      {cls?.subject?.name}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>
          <field_1.FieldError>{errors?.subjectId?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>
            {resourceMode === 'CLASS' ? 'Enseignant' : 'Classe'}
          </field_1.FieldLabel>
          <react_hook_form_1.Controller control={control} name={resourceMode === 'CLASS' ? 'teacherId' : 'groupId'} render={({ field }) => (<select_1.Select value={field.value} onValueChange={(val) => handleSecondaryChange(val, field.onChange)}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder={resourceMode === 'CLASS'
                ? 'Selectionner un enseignant'
                : 'Selectionner une classe'}/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {selectedFilter?.type === 'CLASS' &&
                !!selectedFilter?.id &&
                selectedFilter?.id !== '' && (<>
                        <button_1.Button onClick={() => {
                    setValue('subjectId', '');
                }} variant="ghost">
                          Tous les enseignant
                        </button_1.Button>
                        <select_1.SelectSeparator />
                      </>)}
                  {uniqueSecondaryResources.map((cs) => (<select_1.SelectItem key={resourceMode === 'CLASS'
                    ? cs?.teacher?.id
                    : cs.group?.id} value={resourceMode === 'CLASS'
                    ? cs?.teacher?.id
                    : cs?.group?.id}>
                      {resourceMode === 'CLASS'
                    ? `${cs?.teacher?.user?.profile?.firstname} ${cs.teacher?.user?.profile?.lastname}`
                    : cs?.group?.type === 'SOLO'
                        ? cs.group?.classes[0]?.name
                        : cs.group?.name}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>)}/>
          <field_1.FieldError>{errors?.teacherId?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>
      <field_1.Field>
        <field_1.FieldLabel>Jour</field_1.FieldLabel>
        <react_hook_form_1.Controller control={control} name="day" render={({ field }) => (<select_1.Select value={field.value} onValueChange={field.onChange}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Jour"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {shared_1.dayConstant.map((day) => (<select_1.SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>)}/>
        <field_1.FieldError>{errors.day?.message}</field_1.FieldError>
      </field_1.Field>
      <grid_form_1.GridForm>
        <field_1.Field className="">
          <field_1.FieldLabel>Début</field_1.FieldLabel>
          <time_input_1.TimeInput {...register('startTime')} aria-invalid={!!errors?.startTime}/>
          <field_1.FieldError>{errors.startTime?.message}</field_1.FieldError>
        </field_1.Field>
        <field_1.Field>
          <field_1.FieldLabel>Fin</field_1.FieldLabel>
          <time_input_1.TimeInput {...register('endTime')} aria-invalid={!!errors?.endTime}/>
          <field_1.FieldError>{errors.endTime?.message}</field_1.FieldError>
        </field_1.Field>
      </grid_form_1.GridForm>

      <dialog_1.DialogFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-full">
          {isUpdate && (<>
              {(0, shared_1.canTransition)(lessonStatus, 'ONGOING') && (<button_1.Button type="button" className="text-xs px-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusChange(ui_1.LessonStatus.Ongoing)}>
                  Démarrer
                </button_1.Button>)}
              {(0, shared_1.canTransition)(lessonStatus, 'COMPLETED') && (<button_1.Button type="button" className="text-xs px-2" onClick={() => handleStatusChange(ui_1.LessonStatus.Completed)}>
                  Marquer terminée
                </button_1.Button>)}
              {(0, shared_1.canTransition)(lessonStatus, 'CANCELLED') && (<button_1.Button className="text-xs px-2 bg-gray-600 hover:bg-gray-700" type="button" onClick={() => handleStatusChange(ui_1.LessonStatus.Cancelled)}>
                  Annuler
                </button_1.Button>)}
            </>)}
        </div>
        <div className="flex gap-2">
          {isUpdate && (<button_1.Button type="button" variant="destructive" className="text-xs px-2" onClick={handleDelete}>
              Supprimer
            </button_1.Button>)}
          <button_1.Button type="submit" disabled={!isDirty} className={(0, utils_1.cn)(!isValid && 'cursor-not-allowed', 'font-semibold')}>
            {initialData?.mode === 'UPDATE' ? 'Enregistré' : 'Créer '}
          </button_1.Button>
        </div>
      </dialog_1.DialogFooter>
    </form>);
}
//# sourceMappingURL=lesson-form.js.map