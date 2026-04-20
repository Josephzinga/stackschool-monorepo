'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useMemo } from 'react';
import {
  GetClassSubjectTableQuery,
  GetSubjectsOptionsQuery,
  GetTeacherOptionsQuery,
  useCreateClassSubjectMutation,
  useGetSubjectsOptionsQuery,
  useGetTeacherOptionsQuery,
  useUpdateClassSubjectMutation,
} from '@stackschool/ui';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { GridForm } from '@/components/school/grid-form';
import {
  type CreateClassSubjectFormData,
  createClassSubjectSchema,
} from '@stackschool/shared';
import { useQueryClient } from '@tanstack/react-query';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

export interface InitialValues {
  id: string;
  classId?: string;
  coefficient?: number | null;
  weeklyHours?: number | null;
  subjectId?: string;
  teacherId?: string;
}

interface CreateClassSubjectFormProps {
  classId?: string;
  initialValues?: InitialValues;
  onSuccess?: () => void;
}
export function CreateClassSubjectForm({
  classId,
  initialValues,
  onSuccess,
}: CreateClassSubjectFormProps) {
  const isEdit = !!initialValues?.id;
  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    register,
    formState: { errors, isDirty },
  } = useForm<CreateClassSubjectFormData>({
    resolver: zodResolver(createClassSubjectSchema),
    mode: 'onBlur',
    defaultValues: {
      id: initialValues?.id ?? '',
      classId: initialValues?.classId || classId!,
      coefficient: initialValues?.coefficient || 1,
      weeklyHours: initialValues?.weeklyHours || 2,
      subjectId: initialValues?.subjectId ?? '',
      teacherId: initialValues?.teacherId ?? '',
    },
  });

  const queryClient = useQueryClient();

  const { data: teachersData } = useGetTeacherOptionsQuery({
    input: {
      limit: 100,
    },
  });
  const { data: schoolSubjects } = useGetSubjectsOptionsQuery({
    input: {
      limit: 100,
    },
  });

  const teachers =
    teachersData?.getSchoolTeachers?.data.map((t) => ({
      id: t.id,
      firstname: t.user?.profile?.firstname,
      lastname: t.user?.profile?.lastname,
    })) || [];

  const queryKey = ['GetClassSubjectTable', { classId }];
  const tableData: GetClassSubjectTableQuery | undefined =
    queryClient.getQueryData(queryKey);

  const filteredSubject = useMemo(
    () =>
      schoolSubjects?.getSchoolSubjects?.data?.filter(
        (sub) =>
          !tableData?.class?.group?.classSubjects?.some(
            (cls) => cls?.subject?.id === sub.id,
          ),
      ),
    [schoolSubjects, tableData, isEdit],
  );

  useEffect(() => {
    if (filteredSubject && filteredSubject.length <= 0) {
      setError('subjectId', {
        message:
          "Tous les matière de l'établissements sont déjà assigné dans cette classe.",
      });
    } else {
      clearErrors('subjectId');
    }
  }, []);
  const { mutateAsync: createMutate } = useCreateClassSubjectMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const teachersList: GetTeacherOptionsQuery | undefined =
        queryClient.getQueryData([
          'GetSubjectsOptions',
          { input: { limit: 100 } },
        ]);

      const subjectsList: GetSubjectsOptionsQuery | undefined =
        queryClient.getQueryData([
          'GetSubjectsOptions',
          { input: { limit: 100 } },
        ]);

      const selectedTeacher = teachersList?.getSchoolTeachers?.data?.find(
        (t: any) => t.id === variables.input?.teacherId,
      );
      const selectedSubject = subjectsList?.getSchoolSubjects?.data?.find(
        (s: any) => s.id === variables.input?.subjectId,
      );
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

      queryClient.setQueryData(
        queryKey,
        (old: GetClassSubjectTableQuery | undefined) => {
          if (!old) return old;
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
        },
      );

      return { previous: tableData, queryKey };
    },

    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(
        context.queryKey,
        (old: GetClassSubjectTableQuery | undefined) => ({
          ...old,
          class: {
            ...old?.class,
            classSubject: old?.class?.group?.classSubjects?.map((cls) =>
              cls?.id.startsWith('temp-') ? data?.createClassSubject : cls,
            ),
          },
        }),
      );
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
  const { mutateAsync: updateMutate } = useUpdateClassSubjectMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['GetClassSubjectTable', 'getTeachersTeam'],
      });
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreateClassSubjectFormData) => {
    const promise = isEdit
      ? updateMutate({
          input: data,
        })
      : createMutate({
          input: data,
        });

    console.log('DAta', data);

    toast.promise(promise, {
      loading: isEdit ? 'Modification en cours...' : 'Ajout en cours...',
      success: (data: any) => {
        return isEdit
          ? `Modification reussi avec succès`
          : `Matière ajouter avec succès`;
      },
      error: (err) => {
        return (
          err?.message ||
          (isEdit
            ? 'Erreur lors de la modification.'
            : 'Erreur lors de la création')
        );
      },
      toasterId: 'dashboard',
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log('Erreur', err);
      })}
      className="flex flex-col gap-2"
    >
      <GridForm>
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
                itemToStringLabel={(itemValue) => {
                  const teacher = teachers.find((t) => t.id === itemValue);
                  return teacher
                    ? `${teacher.firstname} ${teacher.lastname}`
                    : '';
                }}
              >
                <ComboboxInput
                  aria-invalid={!!errors.teacherId}
                  disabled={!!initialValues?.teacherId}
                  showClear
                  placeholder="Sélectionner un enseignant"
                  className={cn(
                    'h-10!',
                    !!initialValues?.teacherId && 'hover:cursor-not-allowed',
                  )}
                />
                <ComboboxContent className="z-50">
                  <ComboboxEmpty>Aucun enseignant trouvé</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item.id}>
                        {item.firstname} {item.lastname}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
          <FieldError>{errors.teacherId?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Matière</FieldLabel>
          <Controller
            control={control}
            name="subjectId"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger disabled={isEdit} className="h-10!">
                  <SelectValue placeholder="Selectionner la matière" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubject?.map((subject) => (
                    <SelectItem value={subject?.id!}>
                      <span className="text-sm font-poppins">
                        {subject?.name}{' '}
                        <span className="text-gray-600">{subject?.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError>{errors.subjectId?.message}</FieldError>
        </Field>
      </GridForm>
      <GridForm>
        <Field>
          <FieldLabel>Coéfficient</FieldLabel>
          <Input
            type="number"
            {...register('coefficient')}
            aria-invalid={!!errors.coefficient}
          />
          <FieldError>{errors.coefficient?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Heures par semaine</FieldLabel>

          <Input
            type="number"
            {...register('weeklyHours')}
            aria-invalid={!!errors.weeklyHours}
          />
          <FieldError>{errors?.weeklyHours?.message}</FieldError>
        </Field>
      </GridForm>
      <div className="w-full flex justify-end mt-4">
        <Button disabled={!isDirty} type="submit">
          {isEdit ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
