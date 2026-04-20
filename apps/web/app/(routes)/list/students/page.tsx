'use client';
import { DataTable } from '@/components/school/student/table/data-table';
import { useGetSchoolStudentsQuery } from '@stackschool/ui';
import {
  columns,
  StudentColumns,
} from '@/components/school/student/table/columns';
import {
  TableProvider,
  useTable,
} from '@/components/school/student/table/table-provider';
import { DataTableHeader } from '@/components/school/student/table/data-table-header';
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

  const { filters, pagination, searchTerm } = useTable();

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

  const StudentsData: StudentColumns[] =
    data?.getSchoolStudents?.data.map((s) => ({
      id: s.id,
      phoneNumber: s.user?.phoneNumber ?? '',
      firstname: s.user?.profile?.firstname ?? '',
      lastname: s.user?.profile?.lastname ?? '',
      email: s.user?.email ?? '',
      level: s.schoolClass?.level!,
      status: true,
      className: s.schoolClass?.name ?? '',
      section: s.schoolClass?.section ?? '',
      photo: s.user?.profile?.photo,
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
