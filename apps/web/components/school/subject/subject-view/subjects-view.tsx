'use client';
import { columns, SubjectColumns } from './columns';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useGetClassSubjectTableQuery } from '@stackschool/ui';
import { DataTable } from '@/components/school/subject/subject-view/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateClassSubjectForm } from '@/components/school/create-classSubject-form';

export function ClassSubjectsView({ classId }: { classId?: string }) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useGetClassSubjectTableQuery(
    {
      classId: classId!,
    },
    {
      enabled: !!classId,
    },
  );

  // @ts-ignore
  const subjectData: SubjectColumns[] = data?.class?.group?.classSubjects || [];

  const totalCoefficient = useMemo(() => {
    return subjectData.reduce((acc, sub) => acc + (sub?.coefficient || 0), 0);
  }, [subjectData]);

  return (
    <div className="w-full h-full mt-3 font-poppins z-10 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <h2 className="text-lg opacity-80 font-semibold font-sans">
            Total des coefficients:{' '}
            <span className="text-white">{totalCoefficient}</span>
          </h2>
          <h2 className="text-lg opacity-80 font-semibold font-sans">
            Total des heures:{' '}
          </h2>
        </div>
        <Button onClick={() => setOpen(true)} className="font-semibold">
          Ajouter une matière
        </Button>
      </div>
      <DataTable data={subjectData} isLoading={isPending} columns={columns} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une matière à cette classe</DialogTitle>
          </DialogHeader>
          <CreateClassSubjectForm
            classId={classId}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
