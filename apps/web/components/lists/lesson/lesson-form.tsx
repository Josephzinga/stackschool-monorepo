'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { GridForm } from '@/components/lists/grid-form';
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
  dayConstants,
  dayMapping,
} from '@stackschool/contracts';
import {
  Day,
  LessonStatus,
  ResourceMode,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetClassSubjectsOptionQuery,
  useUpdateLessonMutation,
  useUpdateLessonStatusMutation,
  zodResolver,
} from '@stackschool/ui';
import { toast } from 'sonner';
import { format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { DialogFooter } from '@/components/ui/dialog';

export type InitialLessonData =
  | { mode: 'CREATE'; args: DateSelectArg }
  | { mode: 'UPDATE'; args: EventClickArg }
  | undefined;

type LessonFormProps = {
  initialData: InitialLessonData;
  resourceId?: string;
  onSuccess: () => Promise<void>;
  onClose: () => void;
  resourceMode: ResourceMode;
  selectedFilter?: { type: ResourceMode; id: string } | null;
  isClassOnly?: boolean;
};

export function LessonForm({
  initialData,
  onSuccess,
  onClose,
  resourceMode = 'CLASS',
  selectedFilter,
  resourceId,
  isClassOnly = false,
}: LessonFormProps) {
  const isUpdate = initialData?.mode === 'UPDATE';
  const eventData = isUpdate ? initialData.args.event : null;
  const selectionData = !isUpdate ? initialData?.args : null;

  const subject = eventData?._def?.extendedProps?.subject;
  const teacher = eventData?._def?.extendedProps?.teacher;
  const lessonId = eventData?._def?.extendedProps.lessonId;
  const lessonStatus = eventData?._def?.extendedProps?.status;

  const isClassMode = resourceMode === 'CLASS';

  // Dates normalisées
  const start = eventData ? eventData.start : selectionData?.start;
  const end = eventData ? eventData.end : selectionData?.end;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      startTime: start ? format(start, 'HH:mm') : '',
      endTime: end ? format(end, 'HH:mm') : '',
      day:
        ((start &&
          Object.keys(dayMapping).find(
            (key) => dayMapping[key as Day] === getDay(start),
          )) as CreateLessonFormData['day']) || 'MONDAY',
      subjectId: subject?.id || '',
      teacherId: teacher?.id || '',
      classId: isUpdate
        ? eventData?.extendedProps?.group?.id
        : resourceId || '',
      mode: resourceMode,
    },
  });

  const {
    data: classSubjectData,
    isPending: isLoadingClassSubjects,
    isError: isClassSubjectsError,
  } = useGetClassSubjectsOptionQuery(
    {
      groupId: isClassMode && !isClassOnly ? resourceId : undefined,
      teacherId: !isClassMode ? resourceId : undefined,
      classId: isClassMode && isClassOnly ? resourceId : undefined,
    },
    {
      enabled: !!resourceId,
    },
  );

  useEffect(() => {
    if (isClassSubjectsError) {
      setError('subjectId', { message: 'Erreur de chargement des matières.' });
      setError('teacherId', {
        message: 'Erreur de chargement des enseignants.',
      });
    } else {
      clearErrors('subjectId');
      clearErrors('teacherId');
    }
  }, [isClassSubjectsError, setError, clearErrors]);

  const selectedSubjectId = watch('subjectId');
  const selectedTeacherId = watch('teacherId');
  const selectedClassId = watch('groupId');

  // Filtrage des matières
  const filteredSubjects = useMemo(() => {
    const all = classSubjectData?.getClassSubjects || [];
    if (isClassMode) {
      // Resource mode is CLASS, so filter subjects by classId
      return all.filter((cs) =>
        isClassOnly
          ? cs.group?.classes?.[0]?.id === resourceId
          : cs?.group?.id === resourceId,
      );
    } else {
      // Resource mode is TEACHER, so filter subjects by teacherId
      return all.filter((cs) => cs?.teacher?.id === resourceId);
    }
  }, [classSubjectData, resourceId, isClassMode]);

  const uniqueSubjects = Array.from(
    new Map(filteredSubjects?.map((item) => [item.subject?.id, item])).values(),
  );

  // Filtrage de la "ressource secondaire" (Prof ou Classe)
  const filteredSecondary = useMemo(() => {
    const all = classSubjectData?.getClassSubjects || [];
    if (isClassMode) {
      // Resource mode is CLASS, so secondary is TEACHER
      return all.filter((cs) =>
        isClassOnly
          ? cs.group?.classes?.[0].id === resourceId
          : cs?.group?.id === resourceId &&
            (selectedSubjectId ? cs.subject?.id === selectedSubjectId : true),
      );
    } else {
      // Resource mode is TEACHER, so secondary is CLASS
      return all.filter(
        (cs) =>
          cs?.teacher?.id === resourceId &&
          (selectedSubjectId ? cs.subject?.id === selectedSubjectId : true),
      );
    }
  }, [classSubjectData, resourceId, isClassMode, selectedSubjectId]);

  const uniqueSecondaryResources = Array.from(
    new Map(
      filteredSecondary?.map((item) => [
        isClassMode ? item.teacher?.id : item.group?.id,
        item,
      ]),
    ).values(),
  );

  const handleSubjectChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches = filteredSecondary.filter((cs) => cs.subject?.id === val);

      if (matches.length === 1) {
        const targetId = isClassMode
          ? matches[0].teacher?.id
          : matches[0]?.group?.id;
        setValue(isClassMode ? 'teacherId' : 'groupId', targetId);
      } else {
        setValue(isClassMode ? 'teacherId' : 'groupId', '');
      }
    },
    [filteredSecondary, isClassMode, setValue],
  );

  const handleSecondaryChange = useCallback(
    (val: string, onChange: any) => {
      onChange(val);
      const matches = filteredSecondary.filter((cs) =>
        isClassMode ? cs.teacher?.id === val : cs.group?.id === val,
      );
      if (matches.length === 1) {
        setValue('subjectId', matches?.[0]?.subject?.id ?? '');
      } else {
        setValue('subjectId', '');
      }
    },
    [filteredSecondary, isClassMode, setValue],
  );

  const queryClient = useQueryClient();
  const { mutateAsync: deleteMutate } = useDeleteLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
      onClose();
      onSuccess();
    },
  });
  const { mutateAsync: updateStatusMutate } = useUpdateLessonStatusMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
      onClose();
      onSuccess();
    },
  });

  const { mutateAsync: updateMutate } = useUpdateLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
      onClose();
      onSuccess();
    },
  });

  const { mutateAsync: createMutate } = useCreateLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreateLessonFormData) => {
    const commonData = {
      startTime: data.startTime,
      endTime: data.endTime,
      day: data.day as Day,
      teacherId: data.teacherId,
      groupId: data.groupId,
      subjectId: data.subjectId,
      mode: resourceMode,
    };

    const promise = isUpdate
      ? updateMutate({
          input: { id: lessonId!, ...commonData },
        })
      : createMutate({
          input: commonData,
        });

    toast.promise(promise, {
      loading: isUpdate ? 'Modification en cours...' : 'Création en cours...',
      success: (res: any) => {
        return isUpdate
          ? 'Modification du leçon réussi avec succès.'
          : 'Leçon crée avec succès.';
      },
      error: (err) => {
        return (
          err?.message ||
          (isUpdate
            ? 'Erreur lors de la mise à jour de la leçon'
            : 'Erreur lors de la création de la leçon')
        );
      },
      toasterId: 'dashboard',
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
      success: 'Mise à jour réussie avec succès',
      error: 'Erreur lors de la mise à jour',
      toasterId: 'dashboard',
    });
  };

  const handleDelete = async () => {
    if (!lessonId) return;

    const promise = deleteMutate({
      id: lessonId,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: 'Leçon supprimée avec succès.',
      error: (err) => {
        return err?.message || 'Erreur lors de la suppression de leçon.';
      },
      toasterId: 'lesson-form',
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log('Erreur', err);
      })}
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
                onValueChange={(val) => handleSubjectChange(val, onChange)}
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
                  {selectedFilter?.type === 'CLASS' &&
                    !!selectedFilter?.id &&
                    selectedFilter?.id !== '' && (
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
                  {uniqueSecondaryResources.map((cs) => (
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
                  onClick={() => handleStatusChange(LessonStatus.Completed)}
                >
                  Marquer terminée
                </Button>
              )}
              {canTransition(lessonStatus, 'CANCELLED') && (
                <Button
                  className="text-xs px-2 bg-gray-600 hover:bg-gray-700"
                  type="button"
                  onClick={() => handleStatusChange(LessonStatus.Cancelled)}
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
            disabled={!isDirty}
            className={cn(!isValid && 'cursor-not-allowed', 'font-semibold')}
          >
            {initialData?.mode === 'UPDATE' ? 'Enregistré' : 'Créer '}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
