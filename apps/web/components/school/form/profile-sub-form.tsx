'use client';

import 'react-phone-number-input/style.css';
import { Controller, useFormContext } from 'react-hook-form';
import { GridForm } from '@/components/school/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Mail, User, User2Icon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { checkField } from '@/lib/check-profile-field';

interface ProfileSubFormField {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
}

export function ProfileSubForm() {
  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useFormContext<ProfileSubFormField>();
  const verifiedField = async (
    fieldName: keyof ProfileSubFormField,
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

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <GridForm>
        <Field>
          <FieldLabel>Prénom</FieldLabel>
          <Input
            {...register('firstname')}
            aria-invalid={!!errors.firstname}
            placeholder="Jean"
            icon={User}
          />
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
      </GridForm>
      <GridForm>
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
                aria-invalid={!!errors.email}
                placeholder="jean.dupont@ecole.com"
                onBlur={async (e) => {
                  field.onBlur();
                  await verifiedField('email', e.target.value);
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
                onBlur={async (e) => {
                  field.onBlur();
                  await verifiedField('phoneNumber', watch('phoneNumber'));
                }}
              />
            )}
          />
          <FieldError>{errors.phoneNumber?.message}</FieldError>
        </Field>
      </GridForm>
    </div>
  );
}
