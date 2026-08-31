'use client';
import { DataTable } from '@/components/lists/student/table/data-table';
import { useGetSchoolStudentsQuery } from '@stackschool/ui';
import {
  columns,
  StudentsData,
} from '@/components/lists/student/table/columns';
import {
  TableProvider,
  useStudentTable,
} from '@/components/lists/student/table/table-provider';
import { DataTableHeader } from '@/components/lists/student/table/data-table-header';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';

export default function () {
  return (
    <TableProvider>
      <StudentView />
    </TableProvider>
  );
}

function StudentView() {
  const searchParams = useSearchParams();
  const teacherId = searchParams.get('teacherId');

  const { filters, pagination, searchTerm } = useStudentTable();

  const search = useDebounce(searchTerm, 400);
  const { data, isPending } = useGetSchoolStudentsQuery({
    input: {
      ...filters,
      sort: filters.sort,
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      searchTerm: search,
      teacherId,
    },
  });

  const StudentsData: StudentsData[] =
    data?.getSchoolStudents?.data?.map((s) => ({
      id: s.id,
      firstName: s.schoolProfile?.firstName ?? '',
      lastName: s.schoolProfile?.lastName ?? '',
      level: s.schoolClass?.level!,
      status: true,
      className: s.schoolClass?.name ?? '',
      section: s.schoolClass?.section ?? '',
      avatarUrl: s.schoolProfile?.avatarUrl,
      enrollmentYear: s?.enrollmentYear ?? '',
      matricule: s.matricule,
    })) || [];
  const meta = data?.getSchoolStudents.meta;
  return (
    <div className="flex-1 flex flex-col bg-background p-2 gap-2 md:gap-4 md:p-4 ">
      <DataTableHeader />
      <DataTable
        columns={columns}
        meta={meta}
        data={StudentsData}
        isLoading={isPending}
      />
    </div>
  );
}
