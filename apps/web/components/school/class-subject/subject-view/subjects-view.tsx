'use client';
import { columns, SubjectColumns } from './columns';
import * as React from 'react';
import { useState } from 'react';
import { useGetClassSubjectTableQuery } from '@stackschool/ui';
import { DataTable } from '@/components/school/class-subject/subject-view/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateClassSubjectForm } from '@/components/school/class-subject/create-classSubject-form';

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

  const subjectData: SubjectColumns[] =
    data?.class?.group?.classSubjects?.map((cls) => ({
      id: cls?.id ?? '',
      coefficient: cls?.coefficient || 0,
      weeklyHours: cls?.weeklyHours || 0,
      subject: {
        id: cls?.subject.id!,
        name: cls?.subject?.name ?? '',
        code: cls?.subject?.code ?? '',
      },
      teacher: cls?.assignment?.teacher || null,
    })) || [];

  return (
    <div className="w-full h-full mt-3 font-poppins z-10 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <h2 className="text-lg  opacity-80 font-semibold font-sans">
            Total des coefficients:{' '}
            <span className="text-white">
              {data?.class?.totalCoefficient || 0}
            </span>
          </h2>
          <h2 className="text-lg opacity-80 font-semibold font-sans">
            Total des heures:{' '}
            <span className="text-white">
              {data?.class?.totalWeeklyHours || 0}
            </span>
          </h2>
        </div>
        <Button onClick={() => setOpen(true)} className="font-semibold">
          Ajouter une matière
        </Button>
      </div>
      <DataTable data={subjectData} isLoading={isPending} columns={columns} />

      <Dialog modal={false} open={open} onOpenChange={setOpen}>
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
