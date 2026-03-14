'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GridForm } from '@/components/school/grid-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateClassMutation,
  useGetTeachersQuery,
  useUpdateClassMutation,
  useUserStore,
} from '@stackschool/ui';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';
import { useQueryClient } from '@tanstack/react-query';
import { ClassData } from '@/components/school/class/table/columns';

const createClassSchema = z.object({
  name: z.string().min(1, 'Le nom de classe est requis'),
  level: z.string().min(1, 'Le niveau de classe est requis'),
  section: z.string().optional(),
  supervisorId: z.string().optional(),
});

type CreateClassType = z.infer<typeof createClassSchema>;

interface CreateClassFormProps {
  onSuccess?: () => void;
  editDefaultValues?: ClassData;
}

export default function CreateClassForm({
  onSuccess,
  editDefaultValues,
}: CreateClassFormProps) {
  const { currentSchool } = useUserStore();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateClassType>({
    resolver: zodResolver(createClassSchema),
    mode: 'onBlur',
    defaultValues: {
      name: editDefaultValues?.name || '',
      level: editDefaultValues?.level || '',
      section: editDefaultValues?.section || '',
      supervisorId: editDefaultValues?.supervisor?.id || '',
    },
  });

  const { data: teachersData, isLoading: isLoadingTeachers } =
    useGetTeachersQuery({
      input: {
        limit: 100,
      },
    });

  const { mutateAsync: createMutate } = useCreateClassMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
      if (onSuccess) onSuccess();
    },
  });

  const { mutateAsync: updateMutate } = useUpdateClassMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = async (data: CreateClassType) => {
    try {
      const isEdit = !!editDefaultValues;

      const promise = isEdit
        ? updateMutate({
            classId: editDefaultValues.id,
            data,
            schoolId: currentSchool?.id!,
          })
        : createMutate({
            data,
            schoolId: currentSchool?.id!,
          });

      toast.promise(promise, {
        loading: isEdit ? 'Mise à jour...' : 'Création...',
        success: (res: any) => {
          const response = isEdit ? res.updateClass : res.createClass;
          if (response?.ok) return response.message;
          throw new Error(response?.message || 'Erreur inconnue');
        },
        error: (error) => error.message || "Erreur lors de l'opération",
        toasterId: 'dashboard',
      });
    } catch (error) {
      toast.error("Erreur lors de l'opération");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <GridForm>
        <Field>
          <FieldLabel htmlFor="class_name">Nom de la classe</FieldLabel>
          <Input
            {...register('name')}
            autoComplete="off"
            id="class_name"
            placeholder="Ex: 6ème A"
            aria-invalid={!!errors.name}
          />
          <FieldError>{errors?.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="level">Niveau</FieldLabel>
          <Input
            {...register('level')}
            id="level"
            placeholder="Ex: 6ème"
            aria-invalid={!!errors.level}
          />
          <FieldError>{errors?.level?.message}</FieldError>
        </Field>
      </GridForm>

      <GridForm>
        <Field>
          <FieldLabel htmlFor="section">Section (Optionnel)</FieldLabel>
          <Input
            {...register('section')}
            id="section"
            placeholder="Ex: Science"
            aria-invalid={!!errors.section}
          />
          <FieldError>{errors?.section?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="supervisorId">Professeur principal</FieldLabel>
          <Controller
            control={control}
            name="supervisorId"
            render={({ field: { onChange, value } }) => (
              <Select
                onValueChange={onChange}
                value={value}
                disabled={isLoadingTeachers}
                defaultValue={editDefaultValues?.supervisor?.id}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingTeachers
                        ? 'Chargement...'
                        : 'Sélectionner un professeur'
                    }
                  >
                    {editDefaultValues &&
                      `${editDefaultValues?.supervisor?.profile?.lastname} ${editDefaultValues?.supervisor?.profile?.firstname}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teachersData?.getSchoolTeachers?.data?.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.user?.profile?.firstname}{' '}
                      {teacher.user?.profile?.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors?.supervisorId?.message}</FieldError>
        </Field>
      </GridForm>

      <div className="flex justify-end pt-4">
        <SubmitButton
          disabled={!isDirty || isSubmitting}
          isSubmitting={isSubmitting}
        >
          {editDefaultValues ? 'Mettre à jour' : 'Créer la classe'}
        </SubmitButton>
      </div>
    </form>
  );
}
