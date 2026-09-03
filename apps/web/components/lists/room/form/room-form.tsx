'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GridForm } from '@/components/lists/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateRoomMutation,
  useGetClassesOptionsQuery,
  useUpdateRoomMutation,
} from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  CreateRoomSchema,
  roomTypeConstant,
  UpdateRoomSchema,
} from '@stackschool/contracts';
import { cn } from '@/lib/utils';

export function RoomForm({
  onSucces,
  initialValues,
}: {
  onSucces?: () => void;
  initialValues?: UpdateRoomSchema;
}) {
  const isUpdate = !!initialValues;
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<CreateRoomSchema | UpdateRoomSchema>({
    resolver: zodResolver(isUpdate ? UpdateRoomSchema : CreateRoomSchema),
    mode: 'onBlur',
    defaultValues: {
      id: initialValues?.id,
      name: initialValues?.name || '',
      code: initialValues?.code || '',
      defaultClassId: initialValues?.defaultClassId || '',
      type: initialValues?.type || 'CLASSROOM',
      capacity: initialValues?.capacity || 0,
    },
  });

  const queryClient = useQueryClient();
  const { data } = useGetClassesOptionsQuery({
    input: {
      limit: 100,
    },
    withMeta: false,
    includeGroup: false,
  });
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

  const onSubmit = async (data: CreateRoomSchema | UpdateRoomSchema) => {
    console.log('Data: ', data);
    const promise = isUpdate
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
      loading: isUpdate ? 'Mise à jour en cours...' : 'Création en cours...',
      success: (data: any) => {
        return isUpdate
          ? `La salle ${data?.updateRoom?.name} à été modifier avec succès.`
          : `La salle ${data?.createRoom?.name} à été crée avec succès.`;
      },
      error: (err) => {
        return err?.message || isUpdate
          ? 'Erreur lors de la misse à jour de la salle'
          : 'Erreur lors de la création de la salle';
      },
      toasterId: 'dashboard',
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log('Error: ', err);
      })}
      className="flex flex-col gap-2 md:gap-4"
    >
      <GridForm>
        <Field>
          <FieldLabel htmlFor="name">Nom</FieldLabel>
          <Input
            aria-invalid={!!errors?.name}
            id="name"
            {...register('name')}
            placeholder="Sale d'informatique"
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="code">Code/N°</FieldLabel>
          <Input
            id="code"
            {...register('code')}
            placeholder="10"
            aria-invalid={!!errors?.code}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="capacity">Places</FieldLabel>
          <Input
            aria-invalid={!!errors?.capacity}
            type="number"
            id="capacity"
            placeholder="30"
            {...register('capacity')}
          />
          <FieldError>{errors.capacity?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="type">Type</FieldLabel>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger aria-invalid={!!errors.type}>
                  {!!value ? (
                    roomTypeConstant[value]
                  ) : (
                    <SelectValue placeholder="Type de salle" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roomTypeConstant).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
                <SelectValue placeholder="Sélectionné une classe">
                  {
                    data?.getSchoolClasses.data?.find((d) => d.id === value)
                      ?.name
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {data?.getSchoolClasses.data?.map((cls) => (
                    <SelectItem value={cls?.id!} key={cls?.id}>
                      {cls?.name} ({cls?.level})
                    </SelectItem>
                  ))}
                </SelectGroup>
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
          {isUpdate ? 'Modifier la salle' : '  Crée la salle'}
        </Button>
      </div>
    </form>
  );
}
