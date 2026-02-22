'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateTeacherForm } from '@/components/table/teacher/create-teacher-form'; // Réutilisation !

export function TeacherDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
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
          <CreateTeacherForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
