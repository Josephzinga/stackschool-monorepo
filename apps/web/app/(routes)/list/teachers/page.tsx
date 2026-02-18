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
  const { pagination, searchTerm } = useTable();
  const { currentSchool } = useUserStore();
  const search = useDebounce(500, searchTerm.length > 1 ? searchTerm : '');
  const { data, isPending } = useGetSchoolTeachersQuery(
    {
      schoolId: currentSchool?.id!,
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      searchTerm: search,
    },
    {
      enabled: !!currentSchool.id,
    },
  );

  const teacherData: Teacher[] =
    data?.getSchoolTeachers.data.map((d) => ({
      id: d.id,
      firstname: d.user?.profile?.firstname || '',
      lastname: d.user?.profile?.lastname || '',
      email: d.user?.email || '',
      phoneNumber: d.user?.phoneNumber || '',
      speciality: d.specialization || [],
      classes:
        d.classes?.map((c) => ({
          id: c?.id!,
          name: c?.name!,
        })) || [],
      status: d.isActive || false,
      photo: d.user?.profile?.photo || undefined,
    })) || [];

  const meta = data?.getSchoolTeachers.meta;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-4">
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
