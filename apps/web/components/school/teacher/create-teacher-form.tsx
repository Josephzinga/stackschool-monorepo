'use client';

import {
  CreateTeacherInput,
  useCreateTeacherMutation,
  useForm,
  useUpdateTeacherMutation,
  zodResolver,
} from '@stackschool/ui';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PhoneInput from 'react-phone-number-input';
import {
  createTeacherSchema,
  CreateTeacherValues,
  Gender,
} from '@stackschool/shared';
import 'react-phone-number-input/style.css';
import { checkField } from '@/lib/check-profile-field';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, FormProvider } from 'react-hook-form';
import { Mail, User, User2Icon } from 'lucide-react';

interface CreateTeacherFormProps {
  onSuccess?: () => void;
  editDefaultValues?: CreateTeacherValues;
}

export function CreateTeacherForm({
  onSuccess,
  editDefaultValues,
}: CreateTeacherFormProps) {
  const queryClient = useQueryClient();

  const methods = useForm<CreateTeacherValues>({
    resolver: zodResolver(createTeacherSchema),
    mode: 'onBlur',
    defaultValues: {
      lastname: editDefaultValues?.lastname || '',
      gender: editDefaultValues?.gender,
      firstname: editDefaultValues?.firstname || '',
      email: editDefaultValues?.email || '',
      phoneNumber: editDefaultValues?.phoneNumber || '',
      diploma: editDefaultValues?.diploma || '',
      specialization: editDefaultValues?.specialization,
      classSubjects: editDefaultValues?.classSubjects || [],
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

  const verifiedField = async (
    fieldName: keyof CreateTeacherValues,
    value: string,
  ) => {
    if (!value) return;
    const safeData = await checkField(fieldName as string, value);

    if (!safeData?.valid) {
      setError(fieldName, {
        type: 'onBlur',
        message: safeData?.message,
      });
    } else {
      clearErrors(fieldName);
    }
  };

  const isEdit = !!editDefaultValues;

  const onSubmit = async (data: CreateTeacherInput) => {
    const promise = isEdit
      ? updateMutateAsync({
          data,
          teacherId: editDefaultValues?.id as string,
        })
      : createMutateAsync({
          data,
        });

    toast.promise(promise, {
      loading: isEdit ? 'Modification en cours...' : 'Création en cours...',
      success: (data: any) => {
        return isEdit
          ? data?.updateTeacher?.message || 'Enseignant modifié avec succès'
          : data?.createTeacher?.message || 'Enseignant créé avec succès';
      },
      error: (error) => error.message || 'Une erreur est survenue',
      toasterId: 'dashboard',
    });
  };

  // @ts-ignore
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Infos de base */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <Field>
            <FieldLabel>Prénom</FieldLabel>
            <Input {...register('firstname')} placeholder="Jean" icon={User} />
            <FieldError>{errors.firstname?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Nom</FieldLabel>
            <Input
              {...register('lastname')}
              aria-invalid={!!errors.lastname}
              placeholder="Dupont"
              icon={User2Icon}
            />
            <FieldError>{errors.lastname?.message}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  icon={Mail}
                  placeholder="jean.dupont@ecole.com"
                  onBlur={(e) => {
                    field.onBlur();
                    verifiedField('email', e.target.value);
                  }}
                />
              )}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Téléphone</FieldLabel>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  international
                  defaultCountry="ML"
                  className="phone-input-custom"
                  onBlur={() =>
                    verifiedField('phoneNumber', watch('phoneNumber') || '')
                  }
                />
              )}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>
        </div>

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
        <Field>
          <FieldLabel htmlFor="gender">Genre</FieldLabel>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Homme</SelectItem>
                  <SelectItem value="FEMALE">Femme</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.gender?.message}</FieldError>
        </Field>

        <div className="flex justify-end pt-4">
          <SubmitButton isSubmitting={isSubmitting}>
            {isEdit ? 'Modifier' : "Créer l'enseignant"}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
