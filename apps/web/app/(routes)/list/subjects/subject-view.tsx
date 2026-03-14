'use client';
import { useGetSchoolSubjectsQuery } from '@stackschool/ui';
import {
  columns,
  SubjectColumns,
} from '@/components/school/subject/table/columns';
import { SubjectDataTable } from '@/components/school/subject/table/data-table';
import TableHeader from '@/components/school/subject/table/table-header';
import { useSubjectTable } from '@/components/school/subject/table/table-provider';

export function SubjectView() {
  const { searchTerm, pagination, filters } = useSubjectTable();
  const { data, isPending, isError } = useGetSchoolSubjectsQuery({
    input: {
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      searchTerm,
      classId: filters.classId,
      teacherId: filters.teacherId,
    },
  });

  const subjectData: SubjectColumns[] =
    data?.getSchoolSubjects?.data?.map((s) => ({
      id: s.id,
      code: s?.code,
      name: s?.name,
      category: s?.category,
      mainTeacher: {
        id: s?.mainTeacher?.id!,
        firstname: s?.mainTeacher?.user?.profile?.firstname!,
        lastname: s?.mainTeacher?.user?.profile?.lastname!,
        photo: s?.mainTeacher?.user?.profile?.photo,
      },
      classes: s.classSubject?.map((cs) => ({
        id: cs?.classe.id!,
        name: cs?.classe.name ?? '',
        level: cs?.classe.level ?? '',
      })),
      totalWeeklyHours: s.totalWeeklyHours ?? 0,
    })) || [];
  return (
    <div className="flex-1 flex flex-col gap-4 p-2 sm:p-4">
      <TableHeader />
      <SubjectDataTable
        meta={data?.getSchoolSubjects?.meta}
        isLoading={isPending}
        data={subjectData}
        columns={columns}
      />
    </div>
  );
}
