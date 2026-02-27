'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateStudentForm } from '@/components/school/student/create-student-form';

export function StudentDialog({
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
      <DialogContent className="sm:max-w-150 font-poppins max-h-[90vh] overflow-y-auto bg-accent/70 backdrop-blur-2xl">
        <DialogHeader className="flex w-full justify-center items-center">
          <DialogTitle className="text-2xl font-semibold">
            Nouvel élève
          </DialogTitle>
          <DialogDescription className="-tracking-tighter">
            Remplissez les informations pour ajouter un élève à l'école.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <CreateStudentForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
