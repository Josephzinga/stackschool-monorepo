import { FormProvider, useForm } from 'react-hook-form';
import {
  ParentStudentForm,
  ParentStudentFormSchema,
} from './parent-student-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateParentStudentMutation } from '@stackschool/ui';
import { toast } from '@/components/ui/toast';
import { ParentStudentSchema, parseAxiosError } from '@stackschool/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export interface ParentStudentDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  parentId: string;
  defaultValues?: ParentStudentSchema[];
}
export const ParentStudentDialog = ({
  open,
  onOpenChange,
  parentId,
  defaultValues,
}: ParentStudentDialogProps) => {
  const methods = useForm<ParentStudentFormSchema>({
    resolver: zodResolver(z.object({ children: z.array(ParentStudentSchema) })),
    defaultValues: {
      children: defaultValues,
    },
  });
  const {
    formState: { dirtyFields },
  } = methods;
  const { mutateAsync } = useCreateParentStudentMutation();
  const onSubmit = async (data: ParentStudentFormSchema) => {
    const modifiedChildren = data.children.filter(
      (_, index) => dirtyFields.children?.[index],
    );
    const promise = mutateAsync({
      input: modifiedChildren.map((child) => ({
        parentId,
        studentId: child.studentId,
        relationType: child.relationType,
      })),
    });

    await toast.promise(promise, {
      loading: 'Création en cours...',
      success: (data) => {
        return 'Création réussie avec succès.';
      },
      error: (err) => {
        const { message } = parseAxiosError(err);
        return message || 'Erreur lors de la création.';
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assigné des élèves</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={methods.handleSubmit(onSubmit, (errors, event) => {
              console.log('Error: ', errors);
            })}
          >
            <ParentStudentForm mode="PARENT" />
            <div className="flex justify-end">
              <Button type="submit" className="max-w-35 cursor-pointer">
                Confirmer
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
