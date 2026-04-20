'use client';

import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateParentFormData, createParentSchema } from '@stackschool/shared';
import { GridForm } from '@/components/school/grid-form';
import { ProfileSubForm } from '@/components/school/form/profile-sub-form';
import {
  useCreateParentMutation,
  useSearchStudentQuery,
  useUserStore,
} from '@stackschool/ui';
import { toast } from 'sonner';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export function CreateParentForm({
  initialValues,
}: {
  initialValues?: CreateParentFormData;
}) {
  const { currentSchool } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const methods = useForm<CreateParentFormData>({
    resolver: zodResolver(createParentSchema),
    defaultValues: {
      firstname: initialValues?.firstname,
      lastname: initialValues?.lastname,
      email: initialValues?.email,
      phoneNumber: initialValues?.phoneNumber,
      address: initialValues?.address,
      profession: initialValues?.profession,
      children: initialValues?.children,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, replace, insert } = useFieldArray({
    control,
    name: 'children',
  });
  const isEdit = !!initialValues;

  const { data, isPending } = useSearchStudentQuery(
    {
      input: {
        schoolId: currentSchool?.id,
        searchTerm: debouncedSearch?.trim(),
        limit: 10,
      },
    },
    {
      enabled: !!currentSchool?.id,
    },
  );
  const filteredStudents = useMemo(
    () =>
      data?.searchStudent
        ?.filter((s) => fields.some((f) => f.id !== s.id))
        .filter(Boolean),
    [],
  );

  const {
    mutateAsync: createMutate,
    isError,
    error,
  } = useCreateParentMutation();
  const onSubmit = async (data: CreateParentFormData) => {
    const promise = createMutate({
      input: data,
    });

    toast.promise(promise, {
      loading: isEdit ? 'Modification en cours... ' : 'Creation en cours...',
      success: 'Parent crée avec succès',
      error: (err) => {
        return err?.message || 'Erreur lors de la création du parent';
      },
    });
  };
  console.log('SearchTErm', searchTerm);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={
          (handleSubmit(onSubmit),
          (err) => {
            console.log(err);
          })
        }
        className="flex flex-col gap-4 w-full"
      >
        <ProfileSubForm />
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
          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input
              {...register('address')}
              placeholder="ACI 200 Bamako, Mali"
              aria-invalid={!!errors.address}
            />
            <FieldError errors={[{ message: errors.address?.message }]} />
          </Field>
        </GridForm>

        <Button
          onClick={() => setOpen(!open)}
          type="button"
          variant="outline"
          className="border-dashed! cursor-pointer"
        >
          Ajouter des élève
        </Button>

        <div className="flex flex-row justify-end">
          <Button type="submit" className="cursor-pointer md:px-6">
            {isEdit ? 'Modifier' : 'Créer'}
          </Button>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command shouldFilter={false}>
            <CommandInput onValueChange={setSearchTerm} />
            <CommandList>
              <CommandEmpty>Aucun élève trouvé</CommandEmpty>
              {data?.searchStudent?.map((student) => (
                <CommandItem value={student.id} key={student.id}>
                  {student.user?.profile?.firstname}{' '}
                  {student.user?.profile?.lastname}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </CommandDialog>
      </form>
    </FormProvider>
  );
}
