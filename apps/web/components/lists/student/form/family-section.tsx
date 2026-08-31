import {Controller, useFormContext, useWatch} from 'react-hook-form';
import {Field, FieldError, FieldLabel} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import {CreateStudentSchema} from '@stackschool/contracts';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import React from 'react';
import {Parent, relationItems} from '@stackschool/ui';

export const FamilySection = ({
  parentsData,
}: {
  parentsData: (Parent | null)[] | null;
}) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateStudentSchema>();

  const mode = useWatch({
    control,
    name: 'parentData.mode',
    defaultValue: 'CONNECT',
  });

  return (
    <div className="mt-6 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-slate-700">
        Information du Parent / Tuteur
      </h3>

      <div className="flex gap-4 mb-4">
        <Button
          type="button"
          onClick={() => setValue('parentData.mode', 'CONNECT')}
          variant={mode === 'CONNECT' ? 'secondary' : 'outline'}
        >
          Parent existant
        </Button>
        <Button
          type="button"
          onClick={() => setValue('parentData.mode', 'CREATE')}
          variant={mode === 'CREATE' ? 'secondary' : 'outline'}
        >
          Nouveaux parent
        </Button>
      </div>

      {mode === 'CONNECT' ? (
        <Field>
          <FieldLabel className="block text-sm font-medium mb-1">
            Rechercher un parent (Nom ou Téléphone)
          </FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un parent..." />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </Field>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="parent-firstname">Prènom</FieldLabel>
            <Input
              {...register('parentData.newParent.fistName')}
              placeholder="Prénom du parent"
              id="parent-firstname"
              aria-invalid={!!errors.parentData?.newParent?.firstName}
            />
            <FieldError>
              {errors.parentData?.newParent?.firstName?.message}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="parent-lastname">Nom</FieldLabel>
            <Input
              {...register('parentData.newParent.lastname')}
              placeholder="Nom du parent"
              id="parent-lastname"
              aria-invalid={!!errors.parentData?.newParent?.lastname}
            />

            <FieldError>
              {errors.parentData?.newParent?.lastname?.message}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="parent-phoneNumber">
              Numéro de téléphone
            </FieldLabel>
            <Controller
              control={control}
              name="parentData.newParent.phoneNumber"
              render={({ field }) => (
                <PhoneInput
                  id="phoneNumber"
                  international
                  defaultCountry="ML"
                  {...field}
                  className="phone-input-custom h-10! rounded-lg!"
                  type="phoneNumber"
                  placeholder="+223 XXXXXXXX"
                />
              )}
            />

            <FieldError>
              {errors.parentData?.newParent?.phoneNumber?.message}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="parent-address">Address</FieldLabel>
            <Input
              id="parent-address"
              {...register('parentData.newParent.address')}
              aria-invalid={!!errors.parentData?.newParent?.address}
            />
            <FieldError>
              {errors.parentData?.newParent?.address?.message}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="relation">Type de relation</FieldLabel>
            <Controller
              control={control}
              name="parentData.newParent.relationType"
              render={({ field: { onChange, value } }) => (
                <Select name="relation" value={value} onValueChange={onChange}>
                  <SelectTrigger className="h-10!">
                    <SelectValue placeholder="Selectionner voutre relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationItems.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="parent-profession">Profession</FieldLabel>
            <Input
              id="parent-profession"
              {...register('parentData.newParent.profession')}
              placeholder="Eletricien"
              aria-invalid={!!errors.parentData?.newParent?.profession}
            />
            <FieldError>
              {errors.parentData?.newParent?.profession?.message}
            </FieldError>
          </Field>
        </div>
      )}
    </div>
  );
};
