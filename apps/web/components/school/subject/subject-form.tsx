'use client';
import { GridForm } from '../grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';
import {
  useCreateSubjectMutation,
  useGetNavigationDataQuery,
} from '@stackschool/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { createSubjectForm, CreateSubjectForm } from '@stackschool/shared';
import { categoryMap } from '@/constant';

export default function SubjectForm({
  initialValues,
  onSuccess,
}: {
  initialValues?: CreateSubjectForm;
  onSuccess?: () => void;
}) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isLoading, isDirty },
  } = useForm<CreateSubjectForm>({ resolver: zodResolver(createSubjectForm) });
  const [openDialog, setOpenDialog] = useState(false);
  const [tempClass, setTempClass] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data } = useGetNavigationDataQuery({}, { enabled: !initialValues });
  const { mutateAsync } = useCreateSubjectMutation({
    onMutate: async (newSubject) => {
      await queryClient.cancelQueries({ queryKey: ['GetSchoolSubjects'] });

      const previous = await queryClient.getQueryData(['GetSchoolSubjects']);
      const optimisticObject = {
        ...newSubject.input,
        id: `temp-${Date.now()}`,
        classSubject: [],
        isOptimistic: true,
      };
      queryClient.setQueryData(['GetSchoolSubjects'], (old: any) => ({
        ...old,
        getSchoolSubjects: {
          data: [old?.getSchoolSubjects?.data || [], optimisticObject],
        },
      }));
      return { previous, tempId: optimisticObject.id };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['GetSchoolSubjects'], (old: any) => ({
        ...old,
        getSchoolSubjects: {
          data: old?.getSchoolSubjects?.data?.map((s: any) =>
            s?.id === context.tempId ? data.createSubject : s,
          ),
        },
      }));
    },
    onError: async (error, _, context) => {
      await queryClient.setQueryData(['GetSchoolSubjects'], context?.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolSubjects'] });
    },
  });
  const onSubmit = async (data: CreateSubjectForm) => {
    const promise = mutateAsync({
      input: data,
    });

    toast.promise(promise, {
      loading: 'Création en cours...',
      success: (data) => {
        return `${data?.createSubject?.name} crée avec succès.`;
      },
      error: (err) => {
        return err?.message || 'Erreur lors de la création de la matière.';
      },
      toasterId: 'dashboard',
    });
    if (onSuccess) onSuccess();
  };

  const teachers = data?.getClassTeacher?.teacher;
  const classes = data?.getClassTeacher?.class;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'classSubject',
  });
  const toggleSubject = (classId: string) => {
    setTempClass((prev) =>
      prev?.includes(classId)
        ? prev?.filter((id) => id !== classId)
        : [...prev, classId],
    );
  };
  function handleConfirm() {
    if (tempClass.length === 0) {
      // Si tu utilises sonner ou react-hot-toast
      toast.error('Veuillez sélectionner au moins une classe.', {
        toasterId: 'dashboard',
      });
      return;
    }

    // 1. On trouve les IDs actuellement dans le formulaire
    const currentClassIds = fields.map((f) => f.classId);

    // 2. On retire du formulaire les classes qui ont été décochées dans le modal
    // On boucle à l'envers pour que le remove(index) ne décale pas les index restants
    for (let i = fields.length - 1; i >= 0; i--) {
      if (!tempClass.includes(fields[i].classId)) {
        remove(i);
      }
    }

    // 3. On ajoute les nouvelles classes qui ne sont pas encore dans le formulaire
    const newClassesToAdd = tempClass.filter(
      (id) => !currentClassIds.includes(id),
    );

    newClassesToAdd.forEach((classId) => {
      append({
        classId: classId,
        coefficient: 1,
        weeklyHours: 2,
      });
    });

    setOpenDialog(false);
  }

  return (
    <div className="flex-1">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <GridForm>
          <Field>
            <FieldLabel>Nom</FieldLabel>
            <Input
              {...register('name')}
              aria-invalid={!!errors.name}
              placeholder="Mathématique"
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Code</FieldLabel>
            <Input
              {...register('code')}
              aria-invalid={!!errors.code}
              placeholder="MATH"
            />
            <FieldError>{errors.code?.message}</FieldError>
          </Field>
        </GridForm>
        <GridForm>
          <Field>
            <FieldLabel>Professeur Principal</FieldLabel>
            <Controller
              control={control}
              name="mainTeacherId"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger
                    aria-invalid={!!errors.mainTeacherId}
                    className="h-10!"
                  >
                    <SelectValue placeholder="Selectionner le Professeur Principal"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {teachers?.map((teacher) => (
                      <SelectItem key={teacher?.id} value={teacher?.id!}>
                        <div className="flex flex-col">
                          <span className="text-sm font-inter font-medium">
                            {teacher?.user?.profile?.lastname}
                          </span>
                          <span className="text-[10px] opacity-80 font-poppins">
                            {teacher?.user?.profile?.firstname}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError> {errors.mainTeacherId?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger
                    aria-invalid={!!errors.category}
                    className="h-10!"
                  >
                    <SelectValue placeholder="Selectionner une Categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryMap.map((c) => (
                      <SelectItem value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError className="text-[10px] font-inter">
              {errors.category?.message}
            </FieldError>
          </Field>
        </GridForm>
        {fields.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="text-sm font-medium font-poppins text-muted-foreground">
              Configuration par classe
            </h3>
            {fields?.map((field, index) => {
              const cls = classes?.find((c) => c?.id === field.classId);

              return (
                <div
                  key={field.id}
                  className="flex items-center gap-4 py-1 px-2 border rounded-lg bg-accent/30"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium font-poppins">
                      {cls?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({cls?.level})
                    </p>
                  </div>

                  <div className="w-20 space-y-1">
                    <FieldLabel className="text-xs">Coeff.</FieldLabel>
                    <Controller
                      control={control}
                      name={`classSubject.${index}.coefficient`}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          type="number"
                          min="1"
                          className="h-8! text-sm"
                          aria-invalid={
                            !!errors.classSubject?.[index]?.coefficient
                          }
                          onChange={(event) =>
                            onChange(Number(event.target.value))
                          }
                        />
                      )}
                    />
                    <FieldError>
                      {errors.classSubject?.[index]?.coefficient?.message}
                    </FieldError>
                  </div>

                  <div className="w-20 space-y-1">
                    <FieldLabel className="text-xs">Heures</FieldLabel>
                    <Controller
                      control={control}
                      name={`classSubject.${index}.weeklyHours`}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          type="number"
                          min="1"
                          className="h-8! text-sm"
                          aria-invalid={
                            !!errors.classSubject?.[index]?.weeklyHours
                          }
                          value={value}
                          onChange={(event) =>
                            onChange(Number(event.target.value))
                          }
                        />
                      )}
                    />
                    <FieldError className="text-[8px]!">
                      {errors.classSubject?.[index]?.weeklyHours?.message}
                    </FieldError>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/70 cursor-pointer hover:bg-destructive/10 mt-5"
                    onClick={() => {
                      remove(index);
                      setTempClass((prev) =>
                        prev.filter((id) => id !== field.classId),
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <Dialog
          open={openDialog}
          onOpenChange={(isOpen) => {
            if (isOpen) {
              setTempClass(fields.map((f) => f.classId));
            }
            setOpenDialog(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-center p-1! max-w-45 font-poppins font-medium cursor-pointer hover:bg-primary/50 border-2 border-dashed rounded-lg"
            >
              Assigné aux classes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selectionner des classes</DialogTitle>
              <DialogDescription>
                La classe ou la matière sera enseigné
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-100">
              {classes?.map((cls) => (
                <div
                  key={cls?.id}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md overscroll-y-auto"
                >
                  <Checkbox
                    id={`${cls?.id}`}
                    checked={tempClass.includes(cls?.id!)}
                    onCheckedChange={() => {
                      if (cls?.id) toggleSubject(cls.id);
                    }}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={`${cls?.id}`}
                    className="flex-1 cursor-pointer text-sm font-poppins"
                  >
                    {cls?.name}{' '}
                    <span className="text-muted-foreground text-xs">
                      ({cls?.level})
                    </span>
                  </Label>
                </div>
              ))}
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={tempClass.length === 0}
                className="font-poppins font-medium"
              >
                Ajouter la classe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="w-full flex justify-end items-center">
          <Button type="submit" className="w-50 font-poppins font-semibold">
            Crée la matière
          </Button>
        </div>
      </form>
    </div>
  );
}
