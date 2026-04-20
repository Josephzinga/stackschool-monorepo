'use client';
import {
  ClassStudentTable,
  columns,
} from '@/components/school/class/student-table/columns';
import { DataTable } from '@/components/school/class/student-table/data-table';
import { useGetClassStudentsQuery } from '@stackschool/ui';
import { useDeferredValue, useMemo } from 'react';
import { ClassStudentTableHeader } from '@/components/school/class/student-table/table-header';
import { useQueryState } from 'nuqs';

export function ClassStudentList({ classId }: { classId?: string }) {
  const [search] = useQueryState('search');
  const searchTerm = useDeferredValue(search);
  const { data, isPending, isError, error } = useGetClassStudentsQuery(
    {
      input: {
        classId: classId!,
        searchTerm,
      },
    },
    {
      enabled: !!classId,
    },
  );
  const studentData: ClassStudentTable[] = useMemo(
    () =>
      data?.getSchoolStudents.data?.map((s) => ({
        id: s.id,
        firstname: s.user?.profile?.firstname ?? '',
        lastname: s.user?.profile?.lastname ?? '',
        gender: s.user?.profile?.gender,
        photo: s.user?.profile?.photo ?? undefined,
        matricule: s.matricule,
        studentNumber: s.studentNumber,
        status: s.status,
      })) || [],
    [data],
  );

  const meta = data?.getSchoolStudents.meta;
  return (
    <div className="space-y-2">
      <ClassStudentTableHeader />
      <DataTable
        data={studentData}
        columns={columns}
        meta={meta}
        classId={classId}
        isLoading={isPending}
      />
    </div>
  );
}
