'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import {
  Dialog,
  DialogContent,
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
  ResourceMode,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetClassSubjectOptionsQuery,
  useUpdateLessonMutation,
  useUpdateLessonStatusMutation,
  zodResolver,
} from '@stackschool/ui';
import { toast } from 'sonner';
import { format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useLessonStore } from '@/store/lesson-store';

export type InitialData =
  | { mode: 'CREATE'; args: DateSelectArg }
  | { mode: 'UPDATE'; args: EventClickArg }
  | undefined;

interface LessonDialogProps {
  onSuccess: () => Promise<void>;
}

export default function LessonDialog({ onSuccess }: LessonDialogProps) {
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
  const {
    resourceMode,
    setLessonDialogOpen,
    lessonDialogOpen,
    selectedLessonData,
    selectedFilter,
  } = useLessonStore();
  const isUpdate = selectedLessonData?.mode === 'UPDATE';
  const eventData = isUpdate ? selectedLessonData.args.event : null;
  const selectionData = !isUpdate ? selectedLessonData?.args : null;
  const subject = eventData?._def?.extendedProps?.subject;
  const teacher = eventData?._def?.extendedProps?.teacher;
  const lessonId = eventData?._def?.extendedProps?.lessonId;
  const lessonStatus = eventData?._def?.extendedProps?.status;
  const isClassMode = resourceMode === 'CLASS';
  const [resourceTitle, setResourceTitle] = useState(
    isUpdate
      ? resourceMode === 'CLASS'
        ? eventData?.extendedProps?.groupName
        : `${teacher?.firstname} ${teacher?.lastname}`
      : selectionData?.resource?.title,
  );

  const start = eventData ? eventData.start : selectionData?.start;
  const end = eventData ? eventData.end : selectionData?.end;

  const activeResourceId = isUpdate
    ? eventData?._def.resourceIds?.[0]
    : selectionData?.resource?._resource?.id || selectedFilter?.id;

  const {
    data: classSubjectData,
    isPending,
    isError,
  } = useGetClassSubjectOptionsQuery(
    {
      groupId: isClassMode ? activeResourceId : undefined,
      teacherId: !isClassMode ? activeResourceId : undefined,
    },
    {
      enabled: !!activeResourceId,
    },
  );

  useEffect(() => {
    if (
      (resourceTitle?.toString()?.includes('undefined') || !resourceTitle) &&
      activeResourceId
    ) {
      if (isClassMode) {
        const group = classSubjectData?.getClassSubjects?.find(
          (cls) => cls?.group?.id === activeResourceId,
        )?.group;
        setResourceTitle(
          group?.type === 'SOLO' ? group?.classes?.[0]?.name : group?.name,
        );
      } else {
        const teacher = classSubjectData?.getClassSubjects?.find(
          (cls) => cls?.teacher?.id === activeResourceId,
        )?.teacher;

        setResourceTitle(
          `${teacher?.user?.profile?.firstname} ${teacher?.user?.profile?.lastname}`,
        );
      }
    }
  }, [resourceTitle, activeResourceId, isClassMode]);

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
      resourceMode === 'CLASS'
        ? setValue('teacherId', teacher?.id)
        : setValue('groupId', eventData?.extendedProps?.group?.id);
    }
  }, [selectedLessonData, eventData, setValue, resourceMode]);

  const selectedSubjectId = watch('subjectId');
  const selectedSecondaryId = watch(
    resourceMode === 'CLASS' ? 'teacherId' : 'groupId',
  );

  // Filtrage des matières
  const filteredSubjects = useMemo(() => {
    const all = classSubjectData?.getClassSubjects || [];
    if (!selectedSecondaryId || selectedSecondaryId === '') return all;

    return all.filter((cs) =>
      resourceMode === 'CLASS'
        ? cs?.teacher?.id === selectedSecondaryId
        : cs?.group?.id === selectedSecondaryId,
    );
  }, [classSubjectData, selectedSecondaryId, resourceMode]);

  const uniqueSubjects = Array.from(
    new Map(filteredSubjects?.map((item) => [item.subject?.id, item])).values(),
  );

  // Filtrage de la "ressource secondaire" (Prof ou Classe)
  const filteredSecondary = useMemo(() => {
    const all = classSubjectData?.getClassSubjects || [];
    if (!selectedSubjectId || selectedSubjectId === '') return all;

    return all.filter((cs) => cs.subject?.id === selectedSubjectId);
  }, [classSubjectData, selectedSubjectId]);

  const handleSubjectChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches =
        classSubjectData?.getClassSubjects?.filter(
          (cs) => cs.subject?.id === val,
        ) || [];

      if (matches.length === 1) {
        const targetId =
          resourceMode === 'CLASS'
            ? matches[0].teacher?.id
            : matches[0]?.group?.id;
        setValue(resourceMode === 'CLASS' ? 'teacherId' : 'groupId', targetId);
      }
    },
    [uniqueSubjects, selectedSubjectId],
  );

  const handleSecondaryChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches =
        classSubjectData?.getClassSubjects?.filter((cs) =>
          resourceMode === 'CLASS'
            ? cs.teacher?.id === val
            : cs.group?.id === val,
        ) || [];
      if (matches.length === 1) {
        setValue('subjectId', matches?.[0]?.subject?.id ?? '');
      }
    },
    [resourceMode],
  );
  const queryClient = useQueryClient();
  const { mutateAsync: deleteMutate } = useDeleteLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
    },
  });
  const { mutateAsync: updateStatusMutate } = useUpdateLessonStatusMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
    },
  });

  const { mutateAsync: updateMutate } = useUpdateLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
      onSuccess?.();
      setLessonDialogOpen(false);
    },
  });

  const { mutateAsync: createMutate } = useCreateLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
      setLessonDialogOpen(false);
    },
  });

  const onSubmit = async (data: CreateLessonFormData) => {
    const promise = isUpdate
      ? updateMutate({
          input: {
            startTime: data.startTime,
            endTime: data.endTime,
            id: lessonId,
            day: data.day as Day,
            mode: resourceMode as ResourceMode,
          },
        })
      : createMutate({
          input: {
            ...data,
            day: data?.day as Day,
            mode: resourceMode as ResourceMode,
          },
        });
    toast.promise(promise, {
      loading: isUpdate ? 'Modification en cours...' : 'Création en cours...',
      success: 'Création réussie avec succès',
      error: (err) => {
        return (
          err?.message ||
          (isUpdate
            ? 'Erreur lors de la mise à jour du leçon'
            : 'Erreur lors de la création du leçon')
        );
      },
    });
  };

  const handleStatusChange = async (newStatus: LessonStatus) => {
    if (!lessonId) return;

    const promise = updateStatusMutate({
      status: newStatus,
      id: lessonId,
    });

    toast.promise(promise, {
      loading: 'Mise à jour en cours..',
      success: 'Mise à jour réussi avec succès',
      error: 'Error lors de la mise à jour',
      toasterId: 'dashboard',
    });
    setLessonDialogOpen(false);
  };
  const handleDelete = async () => {
    if (!lessonId) return;

    const promise = deleteMutate({
      id: lessonId,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: 'Leçon supprimer avec succès.',
      error: (err) => {
        return err?.message || 'Erreur lors de la suppression de leçon.';
      },
      toasterId: 'dashboard',
    });
    setLessonDialogOpen(false);
  };
  return (
    <div>
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-110! shadow-2xl!">
          <DialogHeader>
            <DialogTitle>
              {selectedLessonData?.mode === 'CREATE'
                ? 'Créer une leçon'
                : 'Modifier la leçon'}
            </DialogTitle>
            <div className="text-sm opacity-80">
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
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-4"
          >
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
                              onClick={() => setValue('subjectId', '')}
                            >
                              Toute les matières
                            </Button>
                            <SelectSeparator />
                          </>
                        )}
                        {uniqueSubjects?.map((cls) => (
                          <SelectItem
                            key={cls?.subject?.id}
                            value={cls?.subject?.id!}
                          >
                            {cls?.subject?.name}
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
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            resourceMode === 'CLASS'
                              ? 'Selectionner un enseignant'
                              : 'Selectionner une classe'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSecondaryId && selectedSecondaryId !== '' && (
                          <>
                            <Button
                              onClick={() => {
                                setValue('subjectId', '');
                              }}
                              variant="ghost"
                            >
                              Tous les enseignant
                            </Button>
                            <SelectSeparator />
                          </>
                        )}
                        {filteredSecondary.map((cs) => (
                          <SelectItem
                            key={
                              resourceMode === 'CLASS'
                                ? cs?.teacher?.id
                                : cs.group?.id
                            }
                            value={
                              resourceMode === 'CLASS'
                                ? cs?.teacher?.id!
                                : cs?.group?.id!
                            }
                          >
                            {resourceMode === 'CLASS'
                              ? `${cs?.teacher?.user?.profile?.firstname} ${cs.teacher?.user?.profile?.lastname}`
                              : cs?.group?.type === 'SOLO'
                                ? cs.group?.classes[0]?.name
                                : cs.group?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors?.teacherId?.message}</FieldError>
              </Field>
            </GridForm>
            <Field>
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

            <DialogFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-full">
                {isUpdate && (
                  <>
                    {canTransition(lessonStatus, 'ONGOING') && (
                      <Button
                        type="button"
                        className="text-xs px-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleStatusChange(LessonStatus.Ongoing)}
                      >
                        Démarrer
                      </Button>
                    )}
                    {canTransition(lessonStatus, 'COMPLETED') && (
                      <Button
                        type="button"
                        className="text-xs px-2"
                        onClick={() =>
                          handleStatusChange(LessonStatus.Completed)
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
                          handleStatusChange(LessonStatus.Cancelled)
                        }
                      >
                        Annuler
                      </Button>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isUpdate && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="text-xs px-2"
                    onClick={handleDelete}
                  >
                    Supprimer
                  </Button>
                )}
                <Button
                  type="submit"
                  className={cn(
                    !isDirty && 'cursor-not-allowed',
                    'font-semibold',
                  )}
                >
                  {selectedLessonData?.mode === 'UPDATE'
                    ? 'Enregistré'
                    : 'Créer '}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
