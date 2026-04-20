'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateTeacherForm } from '@/components/school/teacher/form/create-teacher-form';
import { CreateTeacherValues } from '@stackschool/shared';

export function TeacherDialog({
  open,
  setOpen,
  defaultValues,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  defaultValues?: CreateTeacherValues;
}) {
  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Professeur</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un enseignant à l'école.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* On passe une prop onSuccess si TeacherForm la supporte, sinon on adaptera */}
          <CreateTeacherForm
            editDefaultValues={defaultValues}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
