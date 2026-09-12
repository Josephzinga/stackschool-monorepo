'use client';

import 'react-phone-number-input/style.css';
import { Controller, useFormContext } from 'react-hook-form';
import { GridForm } from '@/components/lists/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Mail, User, User2Icon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { checkField } from '@/lib/check-profile-field';
import { Gender } from '@stackschool/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { genderOptions } from '@/constant';

interface ProfileSubFormField {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  address: string;
}

export function ProfileSubForm({
  mode,
  verifiedUserId,
}: {
  mode?: 'UPDATE' | 'CREATE';
  verifiedUserId?: string;
}) {
  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    getFieldState,
  } = useFormContext<ProfileSubFormField>();
  const verifiedField = async (
    fieldName: keyof ProfileSubFormField,
    value: string,
    userId?: string,
  ) => {
    if (!value) return;

    const safeData = await checkField(
      { field: fieldName as string, value },
      userId,
    );

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

      <Field>
        <FieldLabel>Email</FieldLabel>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState, formState }) => (
            <Input
              {...field}
              type="email"
              icon={Mail}
              aria-invalid={!!errors.email}
              className="phone-input-custom"
              placeholder="jean.dupont@ecole.com"
              onBlur={async (e) => {
                field.onBlur();
                if (fieldState.isDirty) {
                  await verifiedField(
                    'email',
                    watch('email'),
                    mode === 'UPDATE' ? verifiedUserId : undefined,
                  );
                }
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
          render={({ field, fieldState }) => (
            <PhoneInput
              international
              onChange={(e) => field.onChange(e ?? '')}
              value={field.value}
              defaultCountry="ML"
              className="phone-input-custom"
              onBlur={async (e) => {
                field.onBlur();
                if (fieldState.isDirty) {
                  await verifiedField(
                    'phoneNumber',
                    watch('phoneNumber'),
                    mode === 'UPDATE' ? verifiedUserId : undefined,
                  );
                }
              }}
            />
          )}
        />
        <FieldError>{errors.phoneNumber?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="address">Address</FieldLabel>
        <Input
          {...register('address')}
          placeholder="ACI 200 Bamako, Mali"
          aria-invalid={!!errors.address}
        />
        <FieldError errors={[{ message: errors.address?.message }]} />
      </Field>
      <Field>
        <FieldLabel>Genre</FieldLabel>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select
              items={genderOptions}
              onValueChange={field.onChange}
              {...field}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionné un genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Genre</SelectLabel>
                  {genderOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </Field>
    </GridForm>
  );
}
