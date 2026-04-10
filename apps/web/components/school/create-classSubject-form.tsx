'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useMemo } from 'react';
import {
  GetClassSubjectTableQuery,
  GetSubjectsOptionsQuery,
  GetTeachersQuery,
  useCreateClassSubjectMutation,
  useGetSubjectsOptionsQuery,
  useGetTeachersQuery,
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

export function CreateClassSubjectForm({
  classId,
  initialValues,
  onSuccess,
}: {
  classId?: string;
  initialValues?: CreateClassSubjectFormData;
  onSuccess?: () => void;
}) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isDirty },
  } = useForm<CreateClassSubjectFormData>({
    resolver: zodResolver(createClassSubjectSchema),
    mode: 'onBlur',
    defaultValues: {
      id: initialValues?.id,
      classId: initialValues?.classId || classId!,
      coefficient: initialValues?.coefficient || 1,
      weeklyHours: initialValues?.weeklyHours || 2,
      subjectId: initialValues?.subjectId ?? '',
      teacherId: initialValues?.teacherId ?? '',
    },
  });

  const isEdit = !!initialValues?.id;
  const queryClient = useQueryClient();

  const { data: schoolTeachers } = useGetTeachersQuery({
    input: {
      limit: 100,
    },
  });
  const { data: schoolSubjects } = useGetSubjectsOptionsQuery({
    input: {
      limit: 100,
    },
  });
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
  const { mutateAsync: createMutate } = useCreateClassSubjectMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const teachersList: GetTeachersQuery | undefined =
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
        queryKey: ['GetClassSubjectTable'],
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

    toast.promise(promise, {
      loading: isEdit ? 'Modification en cours...' : 'Ajout en cours...',
      success: (data) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <GridForm>
        <Field>
          <FieldLabel>Professeur</FieldLabel>
          <Controller
            control={control}
            name="teacherId"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger className="h-10!">
                  <SelectValue placeholder="Selectionner un professeur" />
                </SelectTrigger>
                <SelectContent>
                  {schoolTeachers?.getSchoolTeachers?.data?.map((teacher) => (
                    <SelectItem value={teacher?.id!}>
                      <span className="text-sm font-sans">
                        {teacher?.user?.profile?.firstname}{' '}
                        {teacher?.user?.profile?.lastname}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <SelectTrigger className="h-10!">
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
