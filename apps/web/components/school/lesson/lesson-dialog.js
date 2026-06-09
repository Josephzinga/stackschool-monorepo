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
exports.default = LessonDialog;
const react_1 = __importStar(require("react"));
const dialog_1 = require("@/components/ui/dialog");
const grid_form_1 = require("@/components/school/grid-form");
const field_1 = require("@/components/ui/field");
const react_hook_form_1 = require("react-hook-form");
const select_1 = require("@/components/ui/select");
const time_input_1 = require("@/components/time-input");
const button_1 = require("@/components/ui/button");
const button_2 = require("@/components/animate-ui/components/buttons/button");
const shared_1 = require("@stackschool/shared");
const ui_1 = require("@stackschool/ui");
const date_fns_1 = require("date-fns");
const utils_1 = require("@/lib/utils");
const lesson_store_1 = require("@/store/lesson-store");
const useLessonMutations_1 = require("@/components/school/lesson/hooks/useLessonMutations");
function LessonDialog({ onSuccess }) {
    const { resourceMode, setLessonDialogOpen, lessonDialogOpen, selectedLessonData, resource, setResource, } = (0, lesson_store_1.useLessonStore)();
    const isClassMode = resourceMode === 'CLASS';
    const isUpdate = selectedLessonData?.mode === 'UPDATE';
    const { register, control, handleSubmit, setValue, watch, setError, clearErrors, formState: { errors, isValid, isDirty }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, ui_1.zodResolver)(shared_1.createLessonSchema),
    });
    const { handleDelete, handleSubmitForm, handleUpdateStatus } = (0, useLessonMutations_1.useLessonMutations)();
    const eventData = isUpdate ? selectedLessonData.args.event : null;
    const selectionData = !isUpdate ? selectedLessonData?.args : null;
    const subject = eventData?._def?.extendedProps?.subject;
    const teacher = eventData?._def?.extendedProps?.teacher;
    const lessonId = eventData?._def?.extendedProps?.lessonId;
    const lessonStatus = eventData?._def?.extendedProps?.status;
    const resourceTitle = isUpdate
        ? resourceMode === 'CLASS'
            ? eventData?.extendedProps?.groupName
            : `${teacher?.firstname} ${teacher?.lastname}`
        : selectionData?.resource?.title || resource.title;
    const start = eventData ? eventData.start : selectionData?.start;
    const end = eventData ? eventData.end : selectionData?.end;
    const activeResourceId = isUpdate
        ? eventData?._def.resourceIds?.[0]
        : selectionData?.resource?._resource?.id || resource.id;
    console.log('ActiveResourceId', activeResourceId);
    const { data, isError, isPending } = (0, ui_1.useGetAssignmentsQuery)({
        filter: {
            groupId: isClassMode ? activeResourceId : undefined,
            teacherId: !isClassMode ? activeResourceId : undefined,
        },
    }, { enabled: !!activeResourceId });
    const classSubjectData = data?.getAssignments;
    (0, react_1.useEffect)(() => {
        if (isError) {
            setError('subjectId', { message: 'Erreur de chargement des matières.' });
            setError('teacherId', {
                message: 'Erreur de chargement des enseignants.',
            });
        }
        else {
            clearErrors('subjectId');
            clearErrors('teacherId');
        }
    }, [isError]);
    (0, react_1.useEffect)(() => {
        setValue('startTime', start ? (0, date_fns_1.format)(start, 'HH:mm') : '');
        setValue('endTime', end ? (0, date_fns_1.format)(end, 'HH:mm') : '');
        setValue('mode', resourceMode);
        const day = Object.keys(shared_1.dayMapping).find((key) => shared_1.dayMapping[key] === (0, date_fns_1.getDay)(start));
        if (day)
            setValue('day', day);
        if (isUpdate) {
            setValue('subjectId', subject?.id);
            setValue('teacherId', teacher?.id);
            setValue('groupId', eventData?.extendedProps?.group?.id);
        }
        else {
            if (!activeResourceId)
                return;
            isClassMode
                ? setValue('groupId', activeResourceId)
                : setValue('teacherId', activeResourceId);
        }
    }, [selectedLessonData, eventData, setValue, resourceMode, activeResourceId]);
    const selectedSubjectId = watch('subjectId');
    const selectedSecondaryId = watch(isClassMode ? 'teacherId' : 'groupId');
    const filteredSubjects = (0, react_1.useMemo)(() => {
        const all = classSubjectData || [];
        if (!selectedSecondaryId || selectedSecondaryId === '')
            return all;
        return all.filter((ass) => resourceMode === 'CLASS'
            ? ass.teacher?.id === selectedSecondaryId
            : ass.classSubjects?.group.id === selectedSecondaryId);
    }, [classSubjectData, selectedSecondaryId, resourceMode]);
    const uniqueSubjects = Array.from(new Map(filteredSubjects?.map((item) => [item.classSubjects?.subject?.id, item])).values());
    const filteredSecondary = (0, react_1.useMemo)(() => {
        const all = classSubjectData || [];
        if (!selectedSubjectId || selectedSubjectId === '')
            return all;
        return all.filter((ass) => ass.classSubjects?.subject?.id === selectedSubjectId);
    }, [classSubjectData, selectedSubjectId]);
    const uniqueSecondary = Array.from(new Map(filteredSecondary?.map((item) => {
        return isClassMode
            ? [item.teacher?.id, item]
            : [item.classSubjects?.group?.id, item];
    })).values());
    const handleSubjectChange = (0, react_1.useCallback)((val, onChange) => {
        onChange(val);
        const matches = classSubjectData?.filter((cs) => cs.classSubjects?.subject?.id === val) || [];
        if (matches.length === 1) {
            const targetId = resourceMode === 'CLASS'
                ? matches[0].teacher?.id
                : matches[0]?.classSubjects?.group?.id;
            setValue(resourceMode === 'CLASS' ? 'teacherId' : 'groupId', targetId);
        }
    }, [uniqueSubjects, selectedSubjectId]);
    const handleSecondaryChange = (0, react_1.useCallback)((val, onChange) => {
        onChange(val);
        const matches = classSubjectData?.filter((cs) => isClassMode
            ? cs.teacher?.id === val
            : cs?.classSubjects?.group?.id === val) || [];
        if (matches.length === 1) {
            setValue('subjectId', matches?.[0]?.classSubjects?.subject?.id ?? '');
        }
    }, [resourceMode]);
    const onSubmit = async (data) => {
        await handleSubmitForm(data, lessonId, isUpdate);
        onSuccess?.();
    };
    return (<dialog_1.Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
      <dialog_1.DialogContent className="max-w-110! shadow-2xl! px-3 md:px-4">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>
            {selectedLessonData?.mode === 'CREATE'
            ? 'Créer une leçon'
            : 'Modifier la leçon'}
          </dialog_1.DialogTitle>
          <dialog_1.DialogDescription className="text-sm font-poppins font-semibold opacity-80">
            {resourceMode === 'CLASS' ? (<>
                Classe :{' '}
                <span className="text-primary font-medium">
                  {resourceTitle}
                </span>
              </>) : (<>
                Enseignant :{' '}
                <span className="text-primary font-medium">
                  {resourceTitle}
                </span>
              </>)}
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, (err) => {
            console.log('Erreur', err);
        })} className="flex flex-col justify-center gap-4">
          <div className="space-y-2">
            <grid_form_1.GridForm className="w-full">
              <field_1.Field>
                <field_1.FieldLabel>Matière</field_1.FieldLabel>
                <react_hook_form_1.Controller control={control} name="subjectId" render={({ field: { onChange, value } }) => (<select_1.Select onValueChange={(val) => handleSubjectChange(val, onChange)} value={value}>
                      <select_1.SelectTrigger aria-invalid={!!errors?.subjectId}>
                        <select_1.SelectValue placeholder="Selectionner une maitére"></select_1.SelectValue>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {selectedSubjectId && selectedSubjectId !== '' && (<>
                            <button_1.Button variant="ghost" onClick={() => setValue('groupId', '')}>
                              Toute les matières
                            </button_1.Button>
                            <select_1.SelectSeparator />
                          </>)}
                        {uniqueSubjects?.map((cls) => (<select_1.SelectItem key={cls?.classSubjects?.subject?.id} value={cls?.classSubjects?.subject?.id}>
                            {cls?.classSubjects?.subject?.name}
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
                      <select_1.SelectTrigger aria-invalid={isClassMode ? !!errors.teacherId : !!errors.groupId}>
                        <select_1.SelectValue placeholder={isClassMode
                ? 'Sélectionner un enseignant'
                : 'Sélectionner une classe'}/>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {selectedSubjectId && selectedSubjectId !== '' && (<>
                            <button_1.Button onClick={() => {
                    setValue('subjectId', '');
                }} variant="ghost">
                              {isClassMode
                    ? '  Tous les enseignant'
                    : 'Tous les classes'}
                            </button_1.Button>
                            <select_1.SelectSeparator />
                          </>)}
                        {uniqueSecondary?.map((cs) => (<select_1.SelectItem key={isClassMode
                    ? cs?.teacher?.id
                    : cs?.classSubjects?.group?.id} value={isClassMode
                    ? cs?.teacher?.id
                    : cs?.classSubjects?.group?.id}>
                            {isClassMode
                    ? `${cs?.teacher?.user?.profile?.firstname} ${cs.teacher?.user?.profile?.lastname}`
                    : cs?.classSubjects?.group?.type === 'SOLO'
                        ? cs.classSubjects?.group?.classes[0]?.name
                        : cs?.classSubjects?.group?.name}
                          </select_1.SelectItem>))}
                      </select_1.SelectContent>
                    </select_1.Select>)}/>
                <field_1.FieldError>
                  {isClassMode
            ? errors?.teacherId?.message
            : errors.groupId?.message}
                </field_1.FieldError>
              </field_1.Field>
            </grid_form_1.GridForm>
            <field_1.Field className="">
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
          </div>

          <dialog_1.DialogFooter className="flex flex-row md:justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {isUpdate && (<>
                  {(0, shared_1.canTransition)(lessonStatus, 'ONGOING') && (<button_1.Button type="button" className="text-xs px-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleUpdateStatus(ui_1.LessonStatus.Ongoing, lessonId)}>
                      Démarrer
                    </button_1.Button>)}
                  {(0, shared_1.canTransition)(lessonStatus, 'COMPLETED') && (<button_1.Button type="button" className="text-xs px-2" onClick={() => handleUpdateStatus(ui_1.LessonStatus.Completed, lessonId)}>
                      Marquer terminée
                    </button_1.Button>)}
                  {(0, shared_1.canTransition)(lessonStatus, 'CANCELLED') && (<button_1.Button className="text-xs px-2 bg-gray-600 hover:bg-gray-700" type="button" onClick={() => handleUpdateStatus(ui_1.LessonStatus.Cancelled, lessonId)}>
                      Annuler
                    </button_1.Button>)}
                </>)}
            </div>
            <div className="flex gap-2 ">
              {isUpdate && (<button_1.Button type="button" variant="destructive" className="text-xs px-2" onClick={() => handleDelete(lessonId)}>
                  Supprimer
                </button_1.Button>)}
              <button_2.Button hoverScale={1.02} type="submit" className={(0, utils_1.cn)(!isDirty && 'cursor-not-allowed', 'font-semibold')}>
                {selectedLessonData?.mode === 'UPDATE'
            ? 'Enregistré'
            : 'Créer '}
              </button_2.Button>
            </div>
          </dialog_1.DialogFooter>
        </form>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=lesson-dialog.js.map