'use client';

import { useForm } from 'react-hook-form';
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
import { useGetClassSubjectsQuery, useUserStore } from '@stackschool/ui';
import {
  createStudentSchema,
  CreateStudentValues,
  generateStudentMatricule,
} from '@stackschool/shared';
import { useEffect } from 'react';
import { Mail, User, User2Icon, UserX2Icon } from 'lucide-react';

interface CreateStudentFormProps {
  onSuccess?: () => void;
}

export function CreateStudentForm({ onSuccess }: CreateStudentFormProps) {
  const { currentSchool } = useUserStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      enrollmentYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      gender: 'MALE',
    },
  });

  const firstname = watch('firstname');
  const lastname = watch('lastname');

  useEffect(() => {
    if (firstname && lastname) {
      const matricule = generateStudentMatricule(firstname, lastname);
      setValue('matricule', matricule);
    }
  }, [firstname, lastname, setValue]);

  const { data: classesData } = useGetClassSubjectsQuery(
    { input: { schoolId: currentSchool?.id! } },
    { enabled: !!currentSchool?.id },
  );

  const onSubmit = async (data: CreateStudentValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Élève créé avec succès !');
      onSuccess?.();
    } catch (error) {
      toast.error("Erreur lors de la création de l'élève");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section Identité */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Identité
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstname">Prénom</FieldLabel>
            <Input
              {...register('firstname')}
              icon={User}
              id="firstname"
              name="firstname"
              required
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
              required
              aria-invalid={!!errors.lastname}
              placeholder="Diallo"
            />
            <FieldError>{errors.lastname?.message}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email (Optionnel)</FieldLabel>
            <Input
              {...register('email')}
              type="email"
              id="email"
              icon={Mail}
              placeholder="amadou@example.com"
              aria-invalid={!!errors.email}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="gender">Sexe</FieldLabel>
            <Select
              onValueChange={(val: any) => setValue('gender', val)}
              defaultValue="MALE"
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent aria-invalid={!!errors.gender}>
                <SelectItem value="MALE">Masculin</SelectItem>
                <SelectItem value="FEMALE">Féminin</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{errors.gender?.message}</FieldError>
          </Field>
        </div>
      </div>

      {/* Section Scolarité */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Scolarité
        </h3>
        <div className="grid grid-cols-2 gap-4">
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
            <Select onValueChange={(val) => setValue('classId', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>

              <SelectContent className="overflow-y-auto max-h-60">
                {classesData?.getClassSubjects?.map((cls) => (
                  <SelectItem key={cls?.id} value={cls?.id!}>
                    {cls?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.classId?.message}</FieldError>
          </Field>
        </div>
      </div>

      {/* Section Famille */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Famille
        </h3>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <SubmitButton className="w-40" isSubmitting={isSubmitting}>
          Créer l'élève
        </SubmitButton>
      </div>
    </form>
  );
}
