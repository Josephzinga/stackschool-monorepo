'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GridForm } from '@/components/school/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateRoomMutation,
  useGetSchoolClassesOptionsQuery,
  useUpdateRoomMutation,
} from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { CreateRoomFormData, createRoomSchema } from '@stackschool/shared';
import { cn } from '@/lib/utils';

export function RoomForm({
  onSucces,
  initialValues,
}: {
  onSucces?: () => void;
  initialValues?: CreateRoomFormData;
}) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    mode: 'onBlur',
    defaultValues: {
      id: initialValues?.id,
      name: initialValues?.name || '',
      code: initialValues?.code || '',
      defaultClassId: initialValues?.defaultClassId || '',
      type: initialValues?.type || 'CLASSIC',
      capacity: initialValues?.capacity || 0,
    },
  });
  const isEdit = !!initialValues;

  const queryClient = useQueryClient();
  const { data } = useGetSchoolClassesOptionsQuery();
  const { mutateAsync: createMutate } = useCreateRoomMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolRoom'] });
    },
    onSuccess: async (data) => {
      onSucces?.();
    },
  });

  const { mutateAsync: updateMutate } = useUpdateRoomMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolRoom'] });
    },
    onSuccess: async (data) => {
      onSucces?.();
    },
  });

  const onSubmit = async (data: CreateRoomFormData) => {
    const promise = isEdit
      ? updateMutate({
          input: {
            ...data,
            id: initialValues?.id,
          },
        })
      : createMutate({
          input: data,
        });

    toast.promise(promise, {
      loading: isEdit ? 'Mise à jour en cours...' : 'Création en cours...',
      success: (data: any) => {
        return isEdit
          ? `La salle ${data?.updateRoom?.name} à été modifier avec succès.`
          : `La salle ${data?.createRoom?.name} à été crée avec succès.`;
      },
      error: (err) => {
        return err?.message || isEdit
          ? 'Erreur lors de la misse à jour de la salle'
          : 'Erreur lors de la création de la salle';
      },
      toasterId: 'dashboard',
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 md:gap-4"
    >
      <GridForm>
        <Field>
          <FieldLabel htmlFor="name">Nom</FieldLabel>
          <Input
            id="name"
            {...register('name')}
            placeholder="Sale d'informatique"
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="code">Code/N°</FieldLabel>
          <Input id="code" {...register('code')} placeholder="10" />
        </Field>
      </GridForm>
      <GridForm>
        <Field>
          <FieldLabel htmlFor="capacity">Places</FieldLabel>
          <Input
            type="number"
            id="capacity"
            placeholder="30"
            {...register('capacity')}
          />
          <FieldError>{errors.capacity?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="type">Type</FieldLabel>
          <Input id="type" {...register('type')} placeholder="Labo" />
          <FieldError>{errors.type?.message}</FieldError>
        </Field>
      </GridForm>
      <Field>
        <FieldLabel>Classe occupé</FieldLabel>
        <Controller
          control={control}
          name="defaultClassId"
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data?.getClassAndSubjects?.map((cls) => (
                  <SelectItem value={cls?.id!} key={cls?.id}>
                    {cls?.name} ({cls?.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty && isSubmitting}
          className={cn('font-semibold', isSubmitting && 'cursor-not-allowed')}
        >
          {isEdit ? 'Modifier la salle' : '  Crée la salle'}
        </Button>
      </div>
    </form>
  );
}
