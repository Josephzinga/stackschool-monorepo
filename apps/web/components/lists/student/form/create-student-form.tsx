'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';
import {
  Gender,
  GetStudentDetailsQuery,
  StudentStatus,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useUserStore,
} from '@stackschool/ui';
import {
  CreateStudentSchema,
  generateStudentMatricule,
} from '@stackschool/contracts';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { IdentiteSection } from '@/components/lists/student/form/identite-section';
import { SchoolSection } from '@/components/lists/student/form/school-section';
import { FamilySection } from '@/components/lists/student/form/family-section';
import { SanteSection } from '@/components/lists/student/form/sante-section';

interface CreateStudentFormProps {
  mode?: 'QUICK_ADD' | 'FULL_EDIT';
  onSuccess?: () => void;
  initialValues?: GetStudentDetailsQuery['student'];
}

export function CreateStudentForm({
  onSuccess,
  initialValues,
  mode = 'QUICK_ADD',
}: CreateStudentFormProps) {
  const { currentSchool } = useUserStore();
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: zodResolver(
      mode === 'QUICK_ADD'
        ? CreateStudentSchema.omit({ parentData: true })
        : CreateStudentSchema,
    ),
    mode: 'onBlur',
    defaultValues: {
      enrollmentYear:
        initialValues?.enrollmentYear || `${currentYear - 1}-${currentYear}`,
      enrollmentDate: initialValues?.enrollmentDate || undefined,
      firstName: initialValues?.schoolProfile?.firstName || '',
      lastName: initialValues?.schoolProfile?.lastName || '',
      nationality: initialValues?.nationality || 'Malienne',
      classId: initialValues?.schoolClass?.id || '',
      birthDate: initialValues?.birthDate
        ? new Date(initialValues?.birthDate)
        : undefined,
      birthPlace: initialValues?.birthPlace || '',
      gender: (initialValues?.schoolProfile?.gender as Gender) || 'MALE',
      address: initialValues?.schoolProfile?.address || '',
      matricule: initialValues?.matricule || '',
      birthCertificateNumber: initialValues?.birthCertificateNumber || '',
      studentNumber: initialValues?.studentNumber ?? undefined,
      bloodGroup: initialValues?.bloodGroup || '',
      previousSchool: initialValues?.previousSchool ?? '',
      previousClass: initialValues?.previousClass || '',
      allergies: initialValues?.allergies || '',
      ...(mode === 'QUICK_ADD' && {
        parentData: {
          mode: 'CONNECT',
          parentId: '',
        },
      }),
    },
  });
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods;
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  useEffect(() => {}, [initialValues]);

  const { mutateAsync: createMutateAsync } = useCreateStudentMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdateStudentMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
      await queryClient.invalidateQueries({ queryKey: ['GetStudentDetails'] });
    },
  });

  useEffect(() => {
    if (!initialValues && firstName && lastName) {
      const matricule = generateStudentMatricule(firstName, lastName);
      setValue('matricule', matricule);
    }
  }, [firstName, lastName, setValue, initialValues]);

  const onSubmit = async (formData: CreateStudentSchema) => {
    const promise = initialValues
      ? updateMutateAsync({
          input: {
            ...formData,
            gender: formData.gender as Gender,
            status: formData?.status as StudentStatus | undefined,
            transportMode: formData?.transportMode,
            parentData: {
              ...formData?.parentData,
              mode: formData?.parentData?.mode,
            },
          },
          studentId: initialValues?.id!,
        })
      : createMutateAsync({
          input: {
            ...formData,
            gender: formData.gender as Gender,
          },
        });

    toast.promise(promise, {
      loading: initialValues
        ? 'Mise à jour en cours...'
        : 'Création en cours...',
      error: (error) => {
        return error?.message || "Erreur lors de l'opération";
      },
      success: (data: any) => {
        const response = initialValues
          ? data.updateStudent
          : data.createListStudent;

        if (response?.ok) {
          return response.message || 'Opération réussie';
        }
        if (onSuccess) {
          onSuccess();
        }
        return 'Opération terminée';
      },
      toasterId: 'dashboard',
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => {
          console.log('Error', err);
        })}
        className="space-y-6"
      >
        <IdentiteSection mode={mode} />
        <SchoolSection mode={mode} />

        {mode === 'FULL_EDIT' && (
          <FamilySection
            parentsData={
              initialValues?.parentStudent?.map((ps) => ps?.parent ?? null) ||
              []
            }
          />
        )}
        {mode === 'FULL_EDIT' && <SanteSection />}
        <div className={cn('flex justify-end')}>
          <SubmitButton
            className={cn(
              'w-50 font-semibold',
              !isDirty && 'cursor-not-allowed',
            )}
            disabled={isSubmitting || !isDirty}
            isSubmitting={isSubmitting}
          >
            {initialValues ? 'Modifier' : "Créer l'élève"}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
