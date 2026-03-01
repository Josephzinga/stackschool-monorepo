'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Gender,
  Student,
  useCreateListStudentMutation,
  useGetClassSubjectsQuery,
  useUpdateStudentMutation,
  useUserStore,
} from '@stackschool/ui';
import {
  createStudentSchema,
  CreateStudentValues,
  generateStudentMatricule,
} from '@stackschool/shared';
import { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  User,
  User2Icon,
  UserX2Icon,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/animate-ui/components/radix/popover';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { GridForm } from '../grid-form';

interface CreateStudentFormProps {
  onSuccess?: () => void;
  initialValues?: Student;
}

export function CreateStudentForm({
  onSuccess,
  initialValues,
}: CreateStudentFormProps) {
  const { currentSchool } = useUserStore();
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const academicYears = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => `${currentYear - i - 1}-${currentYear - i}`,
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateStudentValues>({
    resolver: zodResolver(createStudentSchema),
    mode: 'onBlur',
    defaultValues: {
      enrollmentYear:
        initialValues?.enrollmentYear || `${currentYear - 1}-${currentYear}`,
      firstname: initialValues?.profile?.firstname || '',
      lastname: initialValues?.profile?.lastname || '',
      motherName: initialValues?.motherName || '',
      fatherName: initialValues?.fatherName || '',
      nationality: initialValues?.nationality || 'Malienne',
      classId: initialValues?.schoolClass?.id || '',
      birthDate: initialValues?.birthDate
        ? new Date(initialValues?.birthDate)
        : undefined,
      gender: (initialValues?.profile?.gender as Gender) || 'MALE',
      matricule: initialValues?.matricule || '',
    },
  });

  const firstname = watch('firstname');
  const lastname = watch('lastname');

  const { mutateAsync: createMutateAsync } = useCreateListStudentMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const {
    data: classesData,
    isError: isGetClassesError,
    error: getClassesError,
  } = useGetClassSubjectsQuery(
    { input: { schoolId: currentSchool?.id! } },
    { enabled: !!currentSchool?.id },
  );

  const { mutateAsync: updateMutateAsync } = useUpdateStudentMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
      await queryClient.invalidateQueries({ queryKey: ['GetStudentDetails'] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  useEffect(() => {
    if (isGetClassesError) {
      setError('classId', {
        message: 'Erreur lors de la récupération des classes',
      });
    }
  }, [isGetClassesError, getClassesError, setError]);

  useEffect(() => {
    if (!initialValues && firstname && lastname) {
      const matricule = generateStudentMatricule(firstname, lastname);
      setValue('matricule', matricule);
    }
  }, [firstname, lastname, setValue, initialValues]);

  const onSubmit = async (formData: CreateStudentValues) => {
    try {
      const promise = initialValues
        ? updateMutateAsync({
            data: {
              ...formData,
              gender: formData.gender as Gender,
            },
            schoolId: currentSchool?.id!,
            studentId: initialValues?.id!,
          })
        : createMutateAsync({
            schoolId: currentSchool?.id!,
            data: {
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
          return 'Opération terminée';
        },
        toasterId: 'dashboard',
      });
    } catch (error) {
      toast.error("Erreur lors de l'opération");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section Identité */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Identité
        </h3>
        <GridForm>
          <Field>
            <FieldLabel htmlFor="firstname">Prénom</FieldLabel>
            <Input
              {...register('firstname')}
              icon={User}
              id="firstname"
              aria-invalid={!!errors.firstname}
              placeholder="Amadou"
            />
            <FieldError>{errors.firstname?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="lastname">Nom</FieldLabel>
            <Input
              {...register('lastname')}
              id="lastname"
              icon={User2Icon}
              aria-invalid={!!errors.lastname}
              placeholder="Diallo"
            />
            <FieldError>{errors.lastname?.message}</FieldError>
          </Field>
        </GridForm>

        <GridForm>
          <Field>
            <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal h-10"
                      aria-invalid={!!errors.birthDate}
                    >
                      {value
                        ? new Date(value).toLocaleDateString()
                        : 'Sélectionner la date'}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-accent"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={value ? new Date(value) : undefined}
                      captionLayout="dropdown"
                      startMonth={new Date(1990, 0)}
                      endMonth={new Date()}
                      onSelect={(date) => {
                        onChange(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError>{errors.birthDate?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="gender">Sexe</FieldLabel>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="gender" className="h-10!">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Masculin</SelectItem>
                    <SelectItem value="FEMALE">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.gender?.message}</FieldError>
          </Field>
        </GridForm>
      </div>

      {/* Section Scolarité */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Scolarité
        </h3>
        <GridForm>
          <Field>
            <FieldLabel htmlFor="matricule">Matricule</FieldLabel>
            <Input
              {...register('matricule')}
              aria-invalid={!!errors.matricule}
              placeholder="STU-..."
              id="matricule"
            />
            <FieldError>{errors.matricule?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Classe</FieldLabel>
            <Controller
              control={control}
              name="classId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10!">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {classesData?.getClassSubjects?.map((cls) => (
                      <SelectItem key={cls?.id} value={cls?.id!}>
                        {cls?.name} {cls?.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.classId?.message}</FieldError>
          </Field>
        </GridForm>
        <GridForm>
          <Field>
            <FieldLabel>Année d'inscription</FieldLabel>
            <Controller
              control={control}
              name="enrollmentYear"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10!">
                    <SelectValue placeholder="Sélectionner l'année" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="nationality">Nationalité</FieldLabel>
            <Input
              id="nationality"
              aria-invalid={!!errors.nationality}
              {...register('nationality')}
            />
            <FieldError>{errors.nationality?.message}</FieldError>
          </Field>
        </GridForm>
      </div>

      {/* Section Famille */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Famille
        </h3>
        <GridForm>
          <Field>
            <FieldLabel htmlFor="fathername">Nom du Père</FieldLabel>
            <Input
              {...register('fatherName')}
              id="fathername"
              icon={UserX2Icon}
              placeholder="Moussa Diallo"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="mothername">Nom de la Mère</FieldLabel>
            <Input
              {...register('motherName')}
              id="mothername"
              aria-invalid={!!errors.motherName}
              placeholder="Aminata Traoré"
            />
          </Field>
        </GridForm>
      </div>

      <div className="flex justify-end pt-4">
        <SubmitButton
          className={cn('w-50 font-semibold', !isDirty && 'cursor-not-allowed')}
          disabled={isSubmitting || !isDirty}
          isSubmitting={isSubmitting}
        >
          {initialValues ? 'Modifier' : "Créer l'élève"}
        </SubmitButton>
      </div>
    </form>
  );
}
