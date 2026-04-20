'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GridForm } from '@/components/school/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeInput } from '@/components/time-input';
import { Button } from '@/components/ui/button';
import { Button as AnimateButton } from '@/components/animate-ui/components/buttons/button';
import {
  canTransition,
  CreateLessonFormData,
  createLessonSchema,
  dayConstant,
  dayMapping,
} from '@stackschool/shared';
import {
  Day,
  LessonStatus,
  useGetAssignmentsQuery,
  zodResolver,
} from '@stackschool/ui';
import { format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLessonStore } from '@/store/lesson-store';
import { useLessonMutations } from '@/components/school/lesson/hooks/useLessonMutations';

export type InitialData =
  | { mode: 'CREATE'; args: DateSelectArg }
  | { mode: 'UPDATE'; args: EventClickArg }
  | undefined;

interface LessonDialogProps {
  onSuccess: () => Promise<void>;
}

export default function LessonDialog({ onSuccess }: LessonDialogProps) {
  const {
    resourceMode,
    setLessonDialogOpen,
    lessonDialogOpen,
    selectedLessonData,
    resource,
    setResource,
  } = useLessonStore();
  const isClassMode = resourceMode === 'CLASS';
  const isUpdate = selectedLessonData?.mode === 'UPDATE';
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonSchema),
  });

  const { handleDelete, handleSubmitForm, handleUpdateStatus } =
    useLessonMutations();

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
  const { data, isError, isPending } = useGetAssignmentsQuery(
    {
      filter: {
        groupId: isClassMode ? activeResourceId : undefined,
        teacherId: !isClassMode ? activeResourceId : undefined,
      },
    },
    { enabled: !!activeResourceId },
  );

  const classSubjectData = data?.getAssignments;

  useEffect(() => {
    if (isError) {
      setError('subjectId', { message: 'Erreur de chargement des matières.' });
      setError('teacherId', {
        message: 'Erreur de chargement des enseignants.',
      });
    } else {
      clearErrors('subjectId');
      clearErrors('teacherId');
    }
  }, [isError]);

  useEffect(() => {
    setValue('startTime', start ? format(start, 'HH:mm') : '');
    setValue('endTime', end ? format(end, 'HH:mm') : '');
    setValue('mode', resourceMode);

    const day = Object.keys(dayMapping).find(
      (key) => dayMapping[key as Day] === getDay(start!),
    );
    if (day) setValue('day', day as CreateLessonFormData['day']);

    if (isUpdate) {
      setValue('subjectId', subject?.id);

      setValue('teacherId', teacher?.id);
      setValue('groupId', eventData?.extendedProps?.group?.id);
    } else {
      if (!activeResourceId) return;
      isClassMode
        ? setValue('groupId', activeResourceId)
        : setValue('teacherId', activeResourceId);
    }
  }, [selectedLessonData, eventData, setValue, resourceMode, activeResourceId]);

  const selectedSubjectId = watch('subjectId');
  const selectedSecondaryId = watch(isClassMode ? 'teacherId' : 'groupId');

  // Filtrage des matières
  const filteredSubjects = useMemo(() => {
    const all = classSubjectData || [];
    if (!selectedSecondaryId || selectedSecondaryId === '') return all;

    return all.filter((ass) =>
      resourceMode === 'CLASS'
        ? ass.teacher?.id === selectedSecondaryId
        : ass.classSubjects?.group.id === selectedSecondaryId,
    );
  }, [classSubjectData, selectedSecondaryId, resourceMode]);
  // garder les unique matières
  const uniqueSubjects = Array.from(
    new Map(
      filteredSubjects?.map((item) => [item.classSubjects?.subject?.id, item]),
    ).values(),
  );

  // Filtrage de la "ressource secondaire" (Prof ou Classe)
  const filteredSecondary = useMemo(() => {
    const all = classSubjectData || [];
    if (!selectedSubjectId || selectedSubjectId === '') return all;

    return all.filter(
      (ass) => ass.classSubjects?.subject?.id === selectedSubjectId,
    );
  }, [classSubjectData, selectedSubjectId]);
  const uniqueSecondary = Array.from(
    new Map(
      filteredSecondary?.map((item) => {
        return isClassMode
          ? [item.teacher?.id, item]
          : [item.classSubjects?.group?.id, item];
      }),
    ).values(),
  );

  // filtre l'input de professeur ou classe selon leur matière enseigné
  const handleSubjectChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches =
        classSubjectData?.filter(
          (cs) => cs.classSubjects?.subject?.id === val,
        ) || [];

      if (matches.length === 1) {
        const targetId =
          resourceMode === 'CLASS'
            ? matches[0].teacher?.id
            : matches[0]?.classSubjects?.group?.id;
        setValue(resourceMode === 'CLASS' ? 'teacherId' : 'groupId', targetId);
      }
    },
    [uniqueSubjects, selectedSubjectId],
  );
  // filtre l'input de professeur ou classe selon la classe ou le professeur sélectionné
  const handleSecondaryChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches =
        classSubjectData?.filter((cs) =>
          isClassMode
            ? cs.teacher?.id === val
            : cs?.classSubjects?.group?.id === val,
        ) || [];
      if (matches.length === 1) {
        setValue('subjectId', matches?.[0]?.classSubjects?.subject?.id ?? '');
      }
    },
    [resourceMode],
  );

  const onSubmit = async (data: CreateLessonFormData) => {
    await handleSubmitForm(data, lessonId, isUpdate);
    onSuccess?.();
  };

  return (
    <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
      <DialogContent className="max-w-110! shadow-2xl! px-3 md:px-4">
        <DialogHeader>
          <DialogTitle>
            {selectedLessonData?.mode === 'CREATE'
              ? 'Créer une leçon'
              : 'Modifier la leçon'}
          </DialogTitle>
          <DialogDescription className="text-sm font-poppins font-semibold opacity-80">
            {resourceMode === 'CLASS' ? (
              <>
                Classe :{' '}
                <span className="text-primary font-medium">
                  {resourceTitle}
                </span>
              </>
            ) : (
              <>
                Enseignant :{' '}
                <span className="text-primary font-medium">
                  {resourceTitle}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log('Erreur', err);
          })}
          className="flex flex-col justify-center gap-4"
        >
          <div className="space-y-2">
            <GridForm className="w-full">
              <Field>
                <FieldLabel>Matière</FieldLabel>
                <Controller
                  control={control}
                  name="subjectId"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      onValueChange={(val) =>
                        handleSubjectChange(val, onChange)
                      }
                      value={value}
                    >
                      <SelectTrigger aria-invalid={!!errors?.subjectId}>
                        <SelectValue placeholder="Selectionner une maitére"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSubjectId && selectedSubjectId !== '' && (
                          <>
                            <Button
                              variant="ghost"
                              onClick={() => setValue('groupId', '')}
                            >
                              Toute les matières
                            </Button>
                            <SelectSeparator />
                          </>
                        )}
                        {uniqueSubjects?.map((cls) => (
                          <SelectItem
                            key={cls?.classSubjects?.subject?.id}
                            value={cls?.classSubjects?.subject?.id!}
                          >
                            {cls?.classSubjects?.subject?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors?.subjectId?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>
                  {resourceMode === 'CLASS' ? 'Enseignant' : 'Classe'}
                </FieldLabel>
                <Controller
                  control={control}
                  name={resourceMode === 'CLASS' ? 'teacherId' : 'groupId'}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        handleSecondaryChange(val, field.onChange)
                      }
                    >
                      <SelectTrigger
                        aria-invalid={
                          isClassMode ? !!errors.teacherId : !!errors.groupId
                        }
                      >
                        <SelectValue
                          placeholder={
                            isClassMode
                              ? 'Sélectionner un enseignant'
                              : 'Sélectionner une classe'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSubjectId && selectedSubjectId !== '' && (
                          <>
                            <Button
                              onClick={() => {
                                setValue('subjectId', '');
                              }}
                              variant="ghost"
                            >
                              {isClassMode
                                ? '  Tous les enseignant'
                                : 'Tous les classes'}
                            </Button>
                            <SelectSeparator />
                          </>
                        )}
                        {uniqueSecondary?.map((cs) => (
                          <SelectItem
                            key={
                              isClassMode
                                ? cs?.teacher?.id
                                : cs?.classSubjects?.group?.id
                            }
                            value={
                              isClassMode
                                ? cs?.teacher?.id!
                                : cs?.classSubjects?.group?.id!
                            }
                          >
                            {isClassMode
                              ? `${cs?.teacher?.user?.profile?.firstname} ${cs.teacher?.user?.profile?.lastname}`
                              : cs?.classSubjects?.group?.type === 'SOLO'
                                ? cs.classSubjects?.group?.classes[0]?.name
                                : cs?.classSubjects?.group?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>
                  {isClassMode
                    ? errors?.teacherId?.message
                    : errors.groupId?.message}
                </FieldError>
              </Field>
            </GridForm>
            <Field className="">
              <FieldLabel>Jour</FieldLabel>
              <Controller
                control={control}
                name="day"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Jour" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayConstant.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.day?.message}</FieldError>
            </Field>
            <GridForm>
              <Field className="">
                <FieldLabel>Début</FieldLabel>
                <TimeInput
                  {...register('startTime')}
                  aria-invalid={!!errors?.startTime}
                />
                <FieldError>{errors.startTime?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Fin</FieldLabel>
                <TimeInput
                  {...register('endTime')}
                  aria-invalid={!!errors?.endTime}
                />
                <FieldError>{errors.endTime?.message}</FieldError>
              </Field>
            </GridForm>
          </div>

          <DialogFooter className="flex flex-row md:justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {isUpdate && (
                <>
                  {canTransition(lessonStatus, 'ONGOING') && (
                    <Button
                      type="button"
                      className="text-xs px-2 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() =>
                        handleUpdateStatus(LessonStatus.Ongoing, lessonId)
                      }
                    >
                      Démarrer
                    </Button>
                  )}
                  {canTransition(lessonStatus, 'COMPLETED') && (
                    <Button
                      type="button"
                      className="text-xs px-2"
                      onClick={() =>
                        handleUpdateStatus(LessonStatus.Completed, lessonId)
                      }
                    >
                      Marquer terminée
                    </Button>
                  )}
                  {canTransition(lessonStatus, 'CANCELLED') && (
                    <Button
                      className="text-xs px-2 bg-gray-600 hover:bg-gray-700"
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(LessonStatus.Cancelled, lessonId)
                      }
                    >
                      Annuler
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2 ">
              {isUpdate && (
                <Button
                  type="button"
                  variant="destructive"
                  className="text-xs px-2"
                  onClick={() => handleDelete(lessonId)}
                >
                  Supprimer
                </Button>
              )}
              <AnimateButton
                hoverScale={1.02}
                type="submit"
                className={cn(
                  !isDirty && 'cursor-not-allowed',
                  'font-semibold',
                )}
              >
                {selectedLessonData?.mode === 'UPDATE'
                  ? 'Enregistré'
                  : 'Créer '}
              </AnimateButton>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
