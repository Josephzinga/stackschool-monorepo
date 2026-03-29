'use client';

import { useForm } from 'react-hook-form';
import {
  useCreateGroupMutation,
  useGetSchoolClassesOptionsQuery,
} from '@stackschool/ui';
import { z } from 'zod';
import { GridForm } from '@/components/school/grid-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

const createGroupSchema = z.object({
  name: z.string(),
  type: z.string(),
  classIds: z.array(z.string()),
});
type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export function GroupForm() {
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
  });
  const [tempClass, setTempClass] = useState<string[]>([]);
  const { data } = useGetSchoolClassesOptionsQuery();
  const { mutateAsync } = useCreateGroupMutation();
  const toggleClass = (classId: string) => {
    console.log('classId', tempClass);
    console.log('Watch', watch('classIds'));
    setValue('classIds', tempClass);
    setTempClass((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId],
    );
  };
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <GridForm>
        <Field>
          <FieldLabel>Nom</FieldLabel>
          <Input {...register('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>type</FieldLabel>
          <Input {...register('type')} />
          <FieldError>{errors.type?.message}</FieldError>
        </Field>
      </GridForm>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Ajouter des classe</Button>
        </DialogTrigger>

        <DialogContent className="w-90">
          <DialogHeader>
            <DialogTitle>Sélectionner des classes</DialogTitle>
            <DialogDescription>
              Sélectionner des classes pour les ajouter dans le group du tronc
              commun
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-100 flex flex-col gap-4">
            {data?.getClassAndSubjects?.map((cls) => (
              <div
                key={cls?.id}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md overscroll-y-auto"
              >
                <Checkbox
                  id={`${cls?.id}`}
                  checked={tempClass.includes(cls?.id!)}
                  onCheckedChange={() => {
                    if (cls?.id) toggleClass(cls.id);
                    console.log('Toggle', cls?.id);
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
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
      {data?.getClassAndSubjects
        ?.filter((cls) => tempClass.some((id) => id === cls?.id))
        .map((cls) => (
          <div>{cls?.name}</div>
        ))}
    </div>
  );
}
