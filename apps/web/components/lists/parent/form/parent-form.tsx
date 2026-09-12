'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateParentSchema,
  parseAxiosError,
  UpdateParentSchema,
} from '@stackschool/contracts';
import { GridForm } from '@/components/lists/grid-form';
import { ProfileSubForm } from '@/components/lists/form/profile-sub-form';
import {
  Gender,
  useCreateParentMutation,
  useUpdateParentMutation,
} from '@stackschool/ui';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { ParentStudentForm } from './parent-student-form';
import { parseAsString, useQueryState } from 'nuqs';
import { useDebounce } from '@/hooks/useDebounce';
import { useQueryClient } from '@tanstack/react-query';

export interface ParentInitialValues extends Omit<
  UpdateParentSchema,
  'children'
> {
  gender?: Gender;
  children: (NonNullable<UpdateParentSchema['children']>[0] & {
    fistName: string;
    lastName: string;
    class: {
      name: string;
      id?: string;
    };
  })[];
}

export interface ParentFormProps {
  initialValues?: UpdateParentSchema & {
    userId?: string;
  };
  onSuccess?: () => void;
  onConfirm?: () => void;
}

export function ParentForm({
  initialValues,
  onSuccess,
  onConfirm,
}: ParentFormProps) {
  const isUpdate = !!initialValues;
  const [searchTerm] = useQueryState('search', parseAsString.withDefault(''));
  const debouncedSearch = useDebounce(searchTerm, 400);
  const queryClient = useQueryClient();
  const methods = useForm<CreateParentSchema | UpdateParentSchema>({
    resolver: zodResolver(isUpdate ? UpdateParentSchema : CreateParentSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: initialValues?.phoneNumber ?? '',
      ...initialValues,
    },
  });

  const {
    register,
    control,
    formState: { errors, dirtyFields },
  } = methods;

  const {
    mutateAsync: createMutate,
    isError,
    error,
  } = useCreateParentMutation({
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });

  const { mutateAsync: updateMutate } = useUpdateParentMutation({
    onSuccess: async (data) => {
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = async (data: CreateParentSchema | UpdateParentSchema) => {
    if (onConfirm) onConfirm();
    const updateData = Object.keys(dirtyFields).reduce(
      (acc, key) => {
        Object.assign(acc, {
          [key]: data[key as keyof (CreateParentSchema | UpdateParentSchema)],
        });
        return acc;
      },
      {} as CreateParentSchema | UpdateParentSchema,
    );

    const promise = isUpdate
      ? updateMutate({
          input: {
            ...updateData,
            id: initialValues?.id,
            children: updateData?.children?.map((child) => ({
              parentId: child.parentId,
              studentId: child.studentId,
              relationType: child.relationType,
            })),
          },
        })
      : createMutate({
          input: data,
        });
    await toast.promise(promise, {
      loading: isUpdate ? 'Modification en cours... ' : 'Creation en cours...',
      success: isUpdate
        ? 'Parent modifié avec succès.'
        : 'Parent crée avec succès',
      error: (err) => {
        const { message } = parseAxiosError(err);
        return (
          message ||
          (isUpdate
            ? 'Erreur lors de la mise à jour.'
            : 'Erreur lors de la création du parent.')
        );
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, (err) => {
          console.log(err);
        })}
        className="flex flex-col gap-2 w-full"
      >
        <ProfileSubForm
          mode={isUpdate ? 'UPDATE' : 'CREATE'}
          verifiedUserId={initialValues?.userId}
        />
        <GridForm>
          <Field>
            <FieldLabel htmlFor="profession">Profession</FieldLabel>
            <Input
              id="profession"
              {...register('profession')}
              placeholder="Électricien"
              aria-invalid={!!errors.profession}
            />
            <FieldError errors={[{ message: errors.profession?.message }]} />
          </Field>
        </GridForm>
        <ParentStudentForm mode="PARENT" />

        <div className="flex flex-row justify-end">
          <Button type="submit" className="cursor-pointer md:px-6">
            {isUpdate ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
