import { useFormContext } from 'react-hook-form';
import { CreateStudentValues } from '@stackschool/shared';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { GridForm } from '@/components/school/grid-form';

export function SanteSection() {
  const {
    register,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateStudentValues>();
  return (
    <GridForm>
      <Field>
        <FieldLabel htmlFor="bloodGroup">Groupe de sang</FieldLabel>
        <Input
          id="bloodGroup"
          {...register('bloodGroup')}
          aria-invalid={!!errors.bloodGroup}
        />
        <FieldError>{errors.bloodGroup?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="allergies">Allergies</FieldLabel>
        <Input
          id="allergies"
          {...register('allergies')}
          aria-invalid={!!errors.allergies}
        />
        <FieldError>{errors.allergies?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="medicalCondition">Condition Medical</FieldLabel>
        <Input
          id="medicalCondition"
          {...register('medicalCondition')}
          aria-invalid={!!errors.medicalCondition}
        />
        <FieldError>{errors.medicalCondition?.message}</FieldError>
      </Field>
    </GridForm>
  );
}
