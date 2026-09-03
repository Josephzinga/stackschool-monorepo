'use client';
import React, { useState } from 'react';
import { GridForm } from '@/components/lists/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, User, User2Icon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PhoneInput from 'react-phone-number-input';
import { CreateStudentSchema } from '@stackschool/contracts';

export function IdentiteSection({
  mode,
}: {
  mode?: 'QUICK_ADD' | 'FULL_EDIT';
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateStudentSchema>();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Identité
      </h3>
      <GridForm>
        <Field>
          <FieldLabel htmlFor="firstname">Prénom</FieldLabel>
          <Input
            {...register('firstName')}
            icon={User}
            id="firstName"
            aria-invalid={!!errors.firstName}
            placeholder="Amadou"
          />
          <FieldError>{errors.firstName?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="lastname">Nom</FieldLabel>
          <Input
            {...register('lastName')}
            id="lastName"
            icon={User2Icon}
            aria-invalid={!!errors.lastName}
            placeholder="Diallo"
          />
          <FieldError>{errors.lastName?.message}</FieldError>
        </Field>
        {mode === 'FULL_EDIT' && (
          <>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...register('email')}
                id="email"
                aria-invalid={!!errors.email}
                placeholder="Johndoe@example.com"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="phoneNumber">Numéro de téléphone</FieldLabel>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <PhoneInput
                    id="phoneNumber"
                    international
                    defaultCountry="ML"
                    {...field}
                    className="phone-input-custom h-10!"
                    type="phoneNumber"
                    placeholder="+223 xxxxxxx"
                  />
                )}
              />
            </Field>
          </>
        )}
        <Field>
          <FieldLabel htmlFor="gender">Sexe</FieldLabel>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                {...field}
                value={field.value}
              >
                <SelectTrigger id="gender" className="h-8!">
                  <SelectValue placeholder="Sélectionner un genre" />
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

        {mode === 'FULL_EDIT' && (
          <>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input {...register('address')} aria-invalid={!!errors.address} />
              <FieldError>{errors.address?.message}</FieldError>
            </Field>
          </>
        )}
        <Field>
          <FieldLabel htmlFor="nationality">Nationalité</FieldLabel>
          <Input
            id="nationality"
            aria-invalid={!!errors.nationality}
            {...register('nationality')}
          />
          <FieldError>{errors.nationality?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between rounded-md font-normal h-8"
                      aria-invalid={!!errors.birthDate}
                    >
                      {value
                        ? new Date(value).toLocaleDateString()
                        : 'Sélectionner la date'}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  }
                ></PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-accent" align="start">
                  <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    captionLayout="dropdown"
                    startMonth={new Date(1990, 0)}
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
          <FieldLabel>Lieu de naissance</FieldLabel>
          <Input
            {...register('birthPlace')}
            aria-invalid={!!errors.birthPlace}
            placeholder="Bamako"
          />
          <FieldError>{errors.birthPlace?.message}</FieldError>
        </Field>
      </GridForm>
    </div>
  );
}
