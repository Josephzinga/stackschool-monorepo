'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateStudentForm } from '@/components/lists/student/form/create-student-form';
import { GetStudentDetailsQuery } from '@stackschool/ui';
import { StudentsData } from '@/components/lists/student/table/columns';

export function StudentDialog({
  open,
  setOpen,
  defaultValues,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  defaultValues?: StudentsData | null;
}) {
  const handleSuccess = () => {
    setOpen(false);
  };
  let initialValues: GetStudentDetailsQuery['student'] = null;

  if (defaultValues) {
    initialValues = {
      id: defaultValues.id!,
      matricule: defaultValues.matricule!,
      enrollmentYear: defaultValues.enrollmentYear ?? '',
      schoolProfile: {
        firstName: defaultValues.firstName!,
        lastName: defaultValues.lastName!,
        gender: defaultValues.gender!,
      },
    };
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-130 font-poppins ">
        <DialogHeader className="flex w-full justify-center items-center">
          <DialogTitle className="text-2xl font-semibold">
            Nouvel élève
          </DialogTitle>
          <DialogDescription className="tracking-wider">
            Remplissez les informations pour ajouter un élève à l'école.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <CreateStudentForm
            initialValues={initialValues}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
