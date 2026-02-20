'use client';

import { DataTable } from '@/components/table/teacher/data-table';
import { columns, Teacher } from '@/components/table/teacher/columns';
import {
  TableProvider,
  useTable,
} from '@/components/table/teacher/table-provider';
import { DataTableHeader } from '@/components/table/teacher/data-table-header';
import { useGetSchoolTeachersQuery, useUserStore } from '@stackschool/ui';
import { useDebounce } from '@/hooks/useDebounce';

export default function TeacherPage() {
  return (
    <TableProvider>
      <TeachersView />
    </TableProvider>
  );
}

function TeachersView() {
  const { pagination, searchTerm, filters } = useTable();
  const { currentSchool } = useUserStore();
  const search = useDebounce(500, searchTerm.length > 1 ? searchTerm : '');

  const { data, isPending } = useGetSchoolTeachersQuery(
    {
      schoolId: currentSchool?.id!,
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      searchTerm: search,
      ...filters,
    },
    {
      enabled: !!currentSchool?.id,
    },
  );

  const teacherData: Teacher[] =
    data?.getSchoolTeachers.data.map((t) => ({
      id: t.id,
      firstname: t.user?.profile?.firstname || '',
      lastname: t.user?.profile?.lastname || '',
      email: t.user?.email || '',
      phoneNumber: t.user?.phoneNumber || '',
      speciality: t.specialization ? [t.specialization] : [],
      classes: t.classes || [],
      status: t.isActive || false,
      photo: t.user?.profile?.photo || undefined,
    })) || [];

  const meta = data?.getSchoolTeachers.meta;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 z-10 gap-4">
      <DataTableHeader />

      <DataTable
        columns={columns}
        data={teacherData}
        meta={meta}
        isLoading={isPending}
      />
    </div>
  );
}
