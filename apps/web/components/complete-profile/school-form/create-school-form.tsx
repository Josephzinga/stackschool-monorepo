// components/complete-profile/school-step/create-school-form.tsx
import { useCompleteProfileStore, useForm, zodResolver } from '@stackschool/ui';
import { createSchoolSchema, CreateSchoolType } from '@stackschool/shared';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/submit-button';
import { Building2, Hash } from 'lucide-react';

export function CreateSchoolForm() {
  const { setSchoolData, school, currentStep, setCurrentStep } =
    useCompleteProfileStore();
  let safeSchool: any = {};
  if (school && school?.type === 'create') {
    safeSchool = school;
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateSchoolType>({
    resolver: zodResolver(createSchoolSchema),
    mode: 'onBlur',
    defaultValues: {
      name: safeSchool?.newSchool?.name || '',
      address: safeSchool?.newSchool?.address || '',
      code: safeSchool?.newSchool?.code || '',
    },
  });

  const nameValue = watch('name');

  const generateSchoolCode = () => {
    // Générer un code basé sur le nom + timestamp
    const initials =
      nameValue
        ?.split(' ')
        .map((word: string) => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 3) || 'SCH';

    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${initials}${random}`;
  };

  const onSubmit = async (data: CreateSchoolType) => {
    const finalData = {
      address: data.address,
      name: data.name,
      imposedRole: 'ADMIN',
      code: data.code || generateSchoolCode(),
    };
    setSchoolData({
      type: 'create',
      newSchool: finalData,
    });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        {/* Nom de l'école */}
        <Field>
          <FieldLabel htmlFor="name">Nom de l'école</FieldLabel>
          <Input
            id="name"
            type="text"
            icon={Building2}
            {...register('name')}
            placeholder="Ex: Groupe Scolaire Les Champions"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-err' : undefined}
          />

          <FieldError id="name-err">{errors.name?.message}</FieldError>
        </Field>

        {/* Adresse */}
        <Field>
          <FieldLabel htmlFor="address">Adresse complète</FieldLabel>
          <Textarea
            id="address"
            rows={3}
            {...register('address')}
            placeholder="Ex: Quartier Hippodrome, Rue 234, Bamako, Mali"
            className="w-full resize-none"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-err' : undefined}
          />
          {/* Note: Textarea n'a pas de prop icon, mais on pourrait l'ajouter ou mettre l'icône à côté */}
        </Field>

        {/* Code de l'école */}
        <Field>
          <FieldLabel htmlFor="code">
            Code de l'école
            <span className="text-gray-500 text-sm font-normal ml-1">
              (optionnel - généré automatiquement si vide)
            </span>
          </FieldLabel>
          <Input
            id="code"
            type="text"
            icon={Hash}
            {...register('code')}
            placeholder="Ex: CHAMP24"
            maxLength={6}
            className="uppercase"
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? 'code-err' : undefined}
          />

          <FieldError id="code-err">{errors.code?.message}</FieldError>

          <p className="text-xs dark:text-slate-300 text-gray-700 mt-1">
            Code suggéré: {generateSchoolCode()}
          </p>
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" type="button">
            Annuler
          </Button>

          <SubmitButton isSubmitting={isSubmitting} className="w-3/4">
            {isSubmitting ? "Crée l'école" : 'Création'}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
