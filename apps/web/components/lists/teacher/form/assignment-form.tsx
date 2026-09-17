'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  useCreateTeacherAssignmentMutation,
  useGetClassesOptionsQuery,
  useGetClassSubjectsOptionQuery,
  useGetTeacherOptionsQuery,
  useSyncTeacherAssignmentMutation,
} from '@stackschool/ui';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Button as AnimatedButton } from '@/components/animate-ui/components/buttons/button';
import { GridForm } from '@/components/lists/grid-form';
import { toast } from '@/components/ui/toast';
import { TeacherAssignmentSchema } from '@stackschool/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { AppAlertDialog } from '@/components/app-alert-dialog';

export type TeacherAssignmentFormProps = {
  initialValues?: {
    teacherId?: string;
    classId?: string;
    subjectIds?: string[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
  showTeacherInput?: boolean;
};

export const TeacherAssignmentForm = ({
  initialValues,
  onSuccess,
  onCancel,
  showTeacherInput = true,
}: TeacherAssignmentFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
    setValue,
    getValues,
  } = useForm<TeacherAssignmentSchema>({
    resolver: zodResolver(TeacherAssignmentSchema),
    defaultValues: {
      teacherId: initialValues?.teacherId || '',
      classId: initialValues?.classId || '',
      subjectIds: initialValues?.subjectIds?.map((id) => id) || [],
    },
  });
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<
      Array<{ id: string | undefined; name: string } | null | undefined>
    >();
  const [open, setOpen] = useState(false);

  const selectedClassId = watch('classId');
  const isClassFixed = !!initialValues?.classId;
  const isEdit = !!initialValues?.classId;
  const queryClient = useQueryClient();

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
  const { data: teachersData } = useGetTeacherOptionsQuery({
    input: { limit: 100 },
    enabled: !initialValues?.teacherId,
  });
  const { data: classesData } = useGetClassesOptionsQuery(
    { input: { limit: 100 }, withMeta: false, includeGroup: false },
    { enabled: !isClassFixed },
  );
  const { data: classSubjects, isLoading: subjectsLoading } =
    useGetClassSubjectsOptionQuery(
      {
        input: {
          classId: selectedClassId || initialValues?.classId || '',
        },
        withGroup: false,
      },
      { enabled: !!(selectedClassId || initialValues?.classId) },
    );

  const anchor = useComboboxAnchor();
  const { mutateAsync: createMutate } = useCreateTeacherAssignmentMutation({
    onSuccess: async () => {
      await invalidateQueries();
    },
  });

  const { mutateAsync: updateMutation } = useSyncTeacherAssignmentMutation({
    onSuccess: async () => {
      await invalidateQueries();
    },
  });

  const classes = classesData?.getSchoolClasses?.data || [];
  const teachers =
    teachersData?.getSchoolTeachers?.data.map((t) => ({
      id: t.id,
      name: `${t.schoolProfile?.firstName}  ${t?.schoolProfile?.lastName}`,
    })) || [];

  const subjects = useMemo(
    () =>
      classSubjects?.getClassSubjects
        ?.filter((cls) =>
          !initialValues?.teacherId
            ? !cls.assignment
            : initialValues.subjectIds?.some((id) => id === cls.subject?.id) ||
              !cls.assignment,
        )
        .map((cs) => ({
          id: cs.subject?.id,
          name: cs.subject?.name,
          code: cs.subject?.code,
        })) || [],
    [classSubjects],
  );
  const map = new Map();
  const uniqueSubjects = subjects.map((subject) => {
    if (map.has(subject.id)) {
    }
    map.set(subject.id, subject);
    return map.get(subject.id);
  });

  const subjectIds = watch('subjectIds');
  useEffect(() => {
    if (initialValues?.subjectIds?.length) {
      const toDelete = initialValues.subjectIds
        .filter((id) => !subjectIds.includes(id))
        .map((id) => subjects?.find((sub) => id === sub.id))
        .filter(Boolean);

      setAssignmentToDelete(toDelete);
    }
  }, [subjectIds]);

  const onSubmit = async (data: TeacherAssignmentSchema) => {
    if (isEdit && assignmentToDelete && assignmentToDelete.length > 0) {
      setOpen(true);
      return;
    } else if (!!initialValues?.teacherId) {
      executeSync(data.subjectIds);
      return;
    }

    const promise = createMutate({
      input: data,
    });

    await toast.promise(promise, {
      loading: "Création de l'assignation en cours...",
      success: 'Création réussie avec succès.',
      error: (err) => {
        return err?.message || "Erreur lors de la création l'assignation ";
      },
    });
  };

  const executeSync = async (ids: string[]) => {
    const promise = updateMutation({
      input: {
        teacherId: initialValues?.teacherId || getValues('teacherId'),
        classId: initialValues?.classId || getValues('classId'),
        subjectIds: ids,
      },
    });

    await toast.promise(promise, {
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
    setValue(
      'subjectIds',
      initialValues?.subjectIds?.map((id) => id)!,
    );
  };
  console.log('initail values', initialValues);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {showTeacherInput && (
          <Field>
            <FieldLabel>Enseignant</FieldLabel>
            <Controller
              control={control}
              name="teacherId"
              render={({ field }) => (
                <Combobox
                  items={teachers}
                  disabled={!!initialValues?.teacherId}
                  value={field.value}
                  onValueChange={field.onChange}
                  itemToStringLabel={(itemValue) =>
                    teachers.find((t) => t.id === itemValue)?.name || ''
                  }
                >
                  <ComboboxInput
                    aria-invalid={!!errors.teacherId}
                    disabled={!!initialValues?.teacherId}
                    placeholder="Sélectionner un enseignant"
                    className="w-full"
                  />
                  <ComboboxContent className="z-50">
                    <ComboboxEmpty>Aucun enseignant trouvé</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item.id}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            <FieldError>{errors.teacherId?.message}</FieldError>
          </Field>
        )}
        <GridForm>
          {/* Sélection de la classe (si non fixée) */}
          {!isClassFixed && (
            <Field>
              <FieldLabel>Classe</FieldLabel>
              <Controller
                control={control}
                name="classId"
                render={({ field }) => (
                  <Combobox
                    items={classes}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue('subjectIds', []);
                    }}
                    itemToStringLabel={(itemValue) => {
                      const cls = classes.find((c) => c.id === itemValue);
                      return cls?.name || '';
                    }}
                  >
                    <ComboboxInput
                      aria-invalid={!!errors.classId}
                      placeholder="Sélectionner une classe"
                      className="h-9"
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>Aucune classe trouvée</ComboboxEmpty>
                      <ComboboxList>
                        {(item, i) => (
                          <ComboboxItem key={`${item.id}_${i}`} value={item.id}>
                            {item.name} {item.level ? `(${item.level})` : ''}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
              <FieldError>{errors.classId?.message}</FieldError>
            </Field>
          )}

          {/* Sélection des matières */}
          <Field>
            <FieldLabel>Matières</FieldLabel>
            <Controller
              control={control}
              name="subjectIds"
              render={({ field }) => (
                <Combobox
                  multiple
                  autoHighlight
                  items={uniqueSubjects}
                  value={field.value}
                  onValueChange={field.onChange}
                  itemToStringValue={(item) => item}
                  disabled={
                    subjectsLoading ||
                    (!selectedClassId && !initialValues?.classId)
                  }
                >
                  <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value: string) => {
                            const sub = uniqueSubjects.find(
                              (s) => s.id === value,
                            );
                            return sub ? (
                              <ComboboxChip key={value}>
                                {sub.name}
                              </ComboboxChip>
                            ) : null;
                          })}
                          <ComboboxChipsInput
                            aria-invalid={!!errors.subjectIds}
                            placeholder={
                              values.length === 0
                                ? subjectsLoading
                                  ? 'Chargement...'
                                  : 'Sélectionner des matières'
                                : ''
                            }
                          />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>
                      {subjectsLoading
                        ? 'Chargement...'
                        : `Aucune matière ${uniqueSubjects?.length === 0 && 'libre'} disponible pour cette classe`}
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(item, i) => (
                        <ComboboxItem key={`${item.id}_${i}`} value={item.id}>
                          {item.name} {item.code && `(${item.code})`}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            <FieldError>{errors.subjectIds?.message}</FieldError>
          </Field>
        </GridForm>

        <div className="flex justify-end gap-2 md:gap-4 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          {initialValues?.teacherId && (
            <AnimatedButton
              onClick={() => {
                setValue('subjectIds', ['']);
                setOpen(true);
              }}
              type="button"
              variant="destructive"
            >
              Supprimer
            </AnimatedButton>
          )}
          <AnimatedButton disabled={!isDirty}>
            {isEdit ? 'Modifier' : 'Ajouter'}
          </AnimatedButton>
        </div>
      </form>
      <AppAlertDialog
        open={open}
        onOpenChange={setOpen}
        onCancel={handleCancel}
        title="Etes-vous sur ?"
        description={`voulez-vous vraiment supprimer La
        ${assignmentToDelete?.map((ass) => ass?.name)} pour 
        ${teachers.find((t) => t.id === initialValues?.teacherId)?.name}
        dans cette classe ?   tous les leçons et autre donnée reliée seront effacer`}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};
