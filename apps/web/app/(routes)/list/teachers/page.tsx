'use client';

import { DataTable } from '@/components/school/teacher/table/data-table';
import { columns, Teacher } from '@/components/school/teacher/table/columns';
import {
  TableProvider,
  useTable,
} from '@/components/school/teacher/table/table-provider';
import { DataTableHeader } from '@/components/school/teacher/table/data-table-header';
import {
  Gender,
  useGetSchoolTeachersQuery,
  useUserStore,
} from '@stackschool/ui';
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
      input: {
        schoolId: currentSchool?.id!,
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        searchTerm: search,
        ...filters,
      },
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
      specialization: t.specialization ? [t.specialization] : [],
      gender: t?.user?.profile?.gender as Gender,
      diploma: t?.diploma ?? '',
      classes:
        t.classes?.map((c) => ({
          id: c?.id!,
          name: c?.name!,
        })) || [],
      status: t.isActive || false,
      photo: t.user?.profile?.photo || undefined,
    })) || [];

  const meta = data?.getSchoolTeachers.meta;

  return (
    <div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
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
