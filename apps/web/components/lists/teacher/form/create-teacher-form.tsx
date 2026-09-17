'use client';

import {
  useCreateTeacherMutation,
  useForm,
  useUpdateTeacherMutation,
  zodResolver,
} from '@stackschool/ui';
import { toast } from '@/components/ui/toast';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { CreateTeacherSchema } from '@stackschool/contracts';
import 'react-phone-number-input/style.css';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider } from 'react-hook-form';
import { ProfileSubForm } from '@/components/lists/form/profile-sub-form';

interface EditDefaultValues extends CreateTeacherSchema {
  id: string;
}

interface CreateTeacherFormProps {
  onSuccess?: () => void;
  editDefaultValues?: EditDefaultValues;
}

export function CreateTeacherForm({
  onSuccess,
  editDefaultValues,
}: CreateTeacherFormProps) {
  const queryClient = useQueryClient();

  const methods = useForm<CreateTeacherSchema>({
    resolver: zodResolver(CreateTeacherSchema),
    mode: 'onBlur',
    defaultValues: {
      lastName: editDefaultValues?.lastName || '',
      gender: editDefaultValues?.gender,
      firstName: editDefaultValues?.firstName || '',
      email: editDefaultValues?.email || '',
      phoneNumber: editDefaultValues?.phoneNumber || '',
      diploma: editDefaultValues?.diploma || '',
      specialization: editDefaultValues?.specialization,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const { mutateAsync: createMutateAsync } = useCreateTeacherMutation({
    onSuccess: async () => {
      if (onSuccess) onSuccess();
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdateTeacherMutation({
    onSuccess: async () => {
      if (onSuccess) onSuccess();
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
    },
  });

  const isEdit = !!editDefaultValues;

  const onSubmit = async (data: CreateTeacherSchema) => {
    const promise = isEdit
      ? updateMutateAsync({
          data: {
            ...data,
            email: data.email ?? null,
          },
          teacherId: editDefaultValues?.id as string,
        })
      : createMutateAsync({
          input: {
            ...data,
            email: data.email ?? null,
          },
        });

    await toast.promise(promise, {
      loading: isEdit ? 'Modification en cours...' : 'Création en cours...',
      success: (data: any) => {
        return isEdit
          ? data?.updateTeacher?.message || 'Enseignant modifié avec succès'
          : data?.createTeacher?.message || 'Enseignant créé avec succès';
      },
      error: (error) => error.message || 'Une erreur est survenue.',
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Infos de base */}
        <ProfileSubForm />

        {/* Diplôme et Spécialité */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <Field>
            <FieldLabel>Diplôme</FieldLabel>
            <Input
              {...register('diploma')}
              aria-invalid={!!errors.diploma}
              placeholder="Master, CAP..."
            />
            <FieldError>{errors.diploma?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Spécialité</FieldLabel>
            <Input
              {...register('specialization')}
              aria-invalid={!!errors.specialization}
              placeholder="Mathématiques"
            />
            <FieldError>{errors.specialization?.message}</FieldError>
          </Field>
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton isSubmitting={isSubmitting}>
            {isEdit ? 'Modifier' : "Créer l'enseignant"}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
