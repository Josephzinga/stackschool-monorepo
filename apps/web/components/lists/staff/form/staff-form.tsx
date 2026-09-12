'use client';

import { ProfileSubForm } from '@/components/lists/form/profile-sub-form';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateStaffSchema,
  parseAxiosError,
  staffPositionOptions,
  UpdateStaffSchema,
} from '@stackschool/contracts';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { GridForm } from '@/components/lists/grid-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateStaffMutation } from '@stackschool/ui';
import { toast } from '@/components/ui/toast';

export interface StaffFormProps {
  onConfirm?: () => void;
  initialValues?: UpdateStaffSchema;
}

export const StaffForm = ({ onConfirm, initialValues }: StaffFormProps) => {
  const isUpdate = !!initialValues;
  const methods = useForm<CreateStaffSchema | UpdateStaffSchema>({
    resolver: zodResolver(isUpdate ? UpdateStaffSchema : CreateStaffSchema),
    mode: 'onChange',
    defaultValues: {
      ...initialValues,
    },
  });

  const {
    control,
    register,
    formState: { errors },
  } = methods;

  const { mutateAsync } = useCreateStaffMutation();

  const onSubmit = async (data: CreateStaffSchema) => {
    onConfirm?.();
    const promise = mutateAsync({
      input: data,
    });

    await toast.promise(promise, {
      loading: 'Création en cours...',
      success: () => {
        return 'Création réussie avec succès.';
      },
      error: (err) => {
        const { message } = parseAxiosError(err);
        return message || 'Erreur lors de la création du personnel.';
      },
    });
  };
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-2 w-full"
        onSubmit={methods.handleSubmit(onSubmit, (err) => {
          console.log('Error: ', err);
        })}
      >
        <ProfileSubForm />
        <GridForm>
          <Field>
            <FieldLabel>Poste occupé</FieldLabel>
            <Controller
              control={control}
              name={'position'}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  items={staffPositionOptions}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seléctionné un poste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Poste occupé</SelectLabel>
                      {staffPositionOptions.map((p) => (
                        <SelectItem
                          className="font-poppins text-xs"
                          key={p.value}
                          value={p.value}
                        >
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field>
            <FieldLabel>Departement</FieldLabel>
            <Input {...register('department')} placeholder="secrétairait" />
            <FieldError errors={[{ message: errors.department?.message }]} />
          </Field>
        </GridForm>
        <div className="flex justify-end mt-4">
          <Button className="w-full max-w-40" type="submit">
            Crée
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
