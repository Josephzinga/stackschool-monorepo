'use client';

import 'react-phone-number-input/style.css';
import { Controller, useFormContext } from 'react-hook-form';
import { GridForm } from '@/components/lists/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Mail, User, User2Icon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { checkField } from '@/lib/check-profile-field';

interface ProfileSubFormField {
  firstName: string;
  lastName: string;
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
            {...register('firstName')}
            aria-invalid={!!errors.firstName}
            placeholder="Jean"
            icon={User}
          />
          <FieldError>{errors.firstName?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Nom</FieldLabel>
          <Input
            {...register('lastName')}
            aria-invalid={!!errors.lastName}
            placeholder="Dupont"
            icon={User2Icon}
          />
          <FieldError>{errors.lastName?.message}</FieldError>
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
                className="phone-input-custom h-8!"
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
                international
                onChange={(e) => field.onChange(e ?? '')}
                value={field.value}
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
