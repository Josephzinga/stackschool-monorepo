'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CreateStudentForm } from '@/components/school/student/form/create-student-form';
import { useQueryClient } from '@tanstack/react-query';
import { GetStudentDetailsQuery } from '@stackschool/ui';

export function UpdateStudentDetails({
  open,
  onOpenChange,
  studentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentData: GetStudentDetailsQuery['student'];
}) {
  const useQuery = useQueryClient();

  const getCacheDelais = async () => {};
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-none w-full sm:w-[600px] md:w-[700px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Modifier les informations</SheetTitle>
          <SheetDescription>
            Modifiez les détails de l'élève et de ses parents.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 px-4 md:px-6">
          <CreateStudentForm mode="FULL_EDIT" initialValues={studentData} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
