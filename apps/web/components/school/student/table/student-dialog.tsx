'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateStudentForm } from '@/components/school/student/form/create-student-form';
import { useGetStudentDetailsQuery, useUserStore } from '@stackschool/ui';
import { LoaderCircleIcon } from 'lucide-react';

export function StudentDialog({
  open,
  setOpen,
  studentId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  studentId?: string;
}) {
  const handleSuccess = () => {
    setOpen(false);
  };
  const { currentSchool } = useUserStore();
  const { data, isPending } = useGetStudentDetailsQuery(
    {
      id: studentId!,
    },
    {
      enabled: open && !!studentId && !!currentSchool?.id,
    },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 font-poppins max-h-[80vh] md:max-h-[90vh]">
        {studentId && isPending ? (
          <div className="flex justify-center items-center min-h-60 h-full">
            <LoaderCircleIcon className="text-primary h-15 w-15 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader className="flex w-full justify-center items-center">
              <DialogTitle className="text-2xl font-semibold">
                Nouvel élève
              </DialogTitle>
              <DialogDescription className="-tracking-tighter">
                Remplissez les informations pour ajouter un élève à l'école.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <CreateStudentForm
                initialValues={data?.student ?? undefined}
                onSuccess={handleSuccess}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
