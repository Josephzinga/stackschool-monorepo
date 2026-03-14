'use client';

import {
  Controller,
  CreateTeacherInput,
  useCreateTeacherMutation,
  useForm,
  useQuery,
  useUpdateTeacherMutation,
  useUserStore,
  zodResolver,
} from '@stackschool/ui';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  api,
  createTeacherSchema,
  CreateTeacherValues,
  Gender,
} from '@stackschool/shared';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, User, User2Icon, X } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { checkField } from '@/lib/check-profile-field';
import { useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Teacher } from '@/components/school/teacher/table/columns';

interface CreateTeacherFormProps {
  onSuccess?: () => void;
  editDefaultValues?: Teacher;
}
type Data = Omit<CreateTeacherValues, 'gender'> & { gender: Gender };
export function CreateTeacherForm({
  onSuccess,
  editDefaultValues,
}: CreateTeacherFormProps) {
  const { currentSchool } = useUserStore();

  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTeacherValues>({
    resolver: zodResolver(createTeacherSchema),
    mode: 'onBlur',
    defaultValues: {
      classIds: editDefaultValues?.classes?.map((cls) => cls.id) || [],
      lastname: editDefaultValues?.lastname || '',
      gender: editDefaultValues?.gender || 'MALE',
      firstname: editDefaultValues?.firstname || '',
      email: editDefaultValues?.email || '',
      phoneNumber: editDefaultValues?.phoneNumber || '',
      diploma: editDefaultValues?.diploma || '',
      specialization: editDefaultValues?.specialization?.join(','),
    },
  });

  const selectedClassIds = watch('classIds') || [];

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classes-light', currentSchool?.id],
    queryFn: async () => {
      const res = await api.get(
        `/api/schools/${currentSchool?.id}/classes?limit=100`,
      );
      if (res.data.ok) return res.data.classes;
      return [];
    },
    enabled: !!currentSchool?.id,
  });

  const { mutateAsync: createMutateAsync } = useCreateTeacherMutation({
    onSuccess: async (data) => {
      if (onSuccess) {
        onSuccess();
      }
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdateTeacherMutation({
    onSuccess: async (data) => {
      if (onSuccess) {
        onSuccess();
      }
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
    },
  });

  const toggleClass = (classId: string) => {
    const current = selectedClassIds;
    if (current.includes(classId)) {
      setValue(
        'classIds',
        current.filter((id) => id !== classId),
      );
    } else {
      setValue('classIds', [...current, classId]);
    }
  };

  const verifiedField = async (
    fieldName: keyof CreateTeacherValues,
    value: string,
  ) => {
    if (!value) return;
    const safeData = await checkField(fieldName as string, value);

    if (safeData?.status === 401) {
      return toast.error(safeData?.message);
    }

    if (!safeData?.valid) {
      console.log('not valid', fieldName);
      setError(fieldName, {
        type: 'onBlur',
        message: safeData?.message,
      });
    } else {
      clearErrors(fieldName);
    }
  };

  const onSubmit = async (data: CreateTeacherInput) => {
    const isEdit = !!editDefaultValues;
    const promise = isEdit
      ? updateMutateAsync({
          data,
          schoolId: currentSchool?.id!,
          teacherId: editDefaultValues?.id as string,
        })
      : createMutateAsync({
          data,
          schoolId: currentSchool?.id!,
        });

    toast.promise(promise, {
      loading: "Création de l'enseignant en cours...",
      success: (data: any) => {
        if (isEdit) {
          return isEdit
            ? data?.updateTeacher?.message
            : 'Enseignant modifié avec succès';
        } else {
          return data?.createTeacher?.message || 'Enseignant créé avec succès';
        }
      },
      error: (error) => {
        return error.message || "Erreur lors de la création de l'enseignant";
      },
      toasterId: 'dashboard',
    });
  };

  const getSelectedClassNames = () => {
    if (!classes) return [];
    return classes
      .filter((c: any) => selectedClassIds.includes(c.id))
      .map((c: any) => ({ name: c.name, id: c.id }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Field>
          <FieldLabel>Prénom</FieldLabel>
          <Input
            {...register('firstname')}
            aria-invalid={!!errors.firstname}
            placeholder="Jean"
            icon={User}
          />
          <FieldError>{errors.firstname?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Nom</FieldLabel>
          <Input
            {...register('lastname')}
            aria-invalid={!!errors.lastname}
            placeholder="Dupont"
            icon={User2Icon}
          />
          <FieldError>{errors.lastname?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, ref, value } }) => (
              <Input
                name="email"
                onChange={onChange}
                value={value}
                ref={ref}
                type="email"
                icon={Mail}
                placeholder="jean.dupont@ecole.com"
                onBlur={() => {
                  verifiedField('email', watch('email') || '');
                  onBlur?.();
                }}
              />
            )}
          />

          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="phoneNumber">Téléphone</FieldLabel>

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, ref, value } }) => (
              <PhoneInput
                id="phoneNumber"
                international
                defaultCountry="ML"
                name="phoneNumber"
                onChange={onChange}
                value={value}
                className="phone-input-custom"
                type="phoneNumber"
                placeholder="jean.dupont@ecole.com"
                onBlur={() => {
                  verifiedField('phoneNumber', watch('phoneNumber')!);
                  onBlur?.();
                }}
              />
            )}
          />
          <FieldError>{errors.phoneNumber?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Field>
          <FieldLabel>Diplôme</FieldLabel>
          <Input
            {...register('diploma')}
            aria-invalid={!!errors.diploma}
            placeholder="Master, CAP..."
          />
          <FieldError>{errors.diploma?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Spécialité</FieldLabel>
          <Input
            {...register('specialization')}
            aria-invalid={!!errors.specialization}
            placeholder="Mathématiques"
          />
          <FieldError>{errors.specialization?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="gender">Genre</FieldLabel>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                aria-invalid={!!errors.gender}
                className="w-full"
                id="gender"
              >
                <SelectValue placeholder="Sélectionnez le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Genre</SelectLabel>
                  <SelectItem value="MALE">Homme</SelectItem>
                  <SelectItem value="FEMALE">Femme</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.gender?.message}</FieldError>
      </Field>

      {/* Sélection des Classes */}
      <div className="space-y-2">
        <FieldLabel>Classes assignées</FieldLabel>
        <div className="flex flex-wrap gap-2 mb-2">
          {getSelectedClassNames()?.map(
            ({ name, id }: { name: string; id: string }) => (
              <Badge
                key={id}
                variant="secondary"
                className="pl-2 pr-1 py-1font-meduim text-xs"
              >
                {name}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                  onClick={() => {
                    const cls = classes.find((c: any) => c.name === name);
                    if (cls) toggleClass(cls.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ),
          )}

          <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs border-dashed"
              >
                <Plus className="h-3 w-3 mr-1" />
                Assigner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-100 font-poppins font-medium w-full justify-center items-center">
              <DialogHeader>
                <DialogTitle>Assigner des classes</DialogTitle>
                <DialogDescription>
                  Sélectionnez les classes où cet enseignant interviendra.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 max-h-[300px] overflow-y-auto space-y-2">
                {isLoadingClasses ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Chargement...
                  </p>
                ) : classes?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Aucune classe trouvée.
                  </p>
                ) : (
                  classes?.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
                    >
                      <Checkbox
                        id={`cls-${cls.id}`}
                        checked={selectedClassIds.includes(cls.id)}
                        onCheckedChange={() => toggleClass(cls.id)}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`cls-${cls.id}`}
                        className="flex-1 cursor-pointer text-sm font-poppins"
                      >
                        {cls.name}{' '}
                        <span className="text-muted-foreground text-xs">
                          ({cls.level})
                        </span>
                      </Label>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  className="font-poppins font-semibold"
                  onClick={() => setIsClassDialogOpen(false)}
                >
                  Terminer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <SubmitButton isSubmitting={isSubmitting}>
          Créer l'enseignant
        </SubmitButton>
      </div>
    </form>
  );
}
