'use client';

import { DataTable } from '@/components/school/teacher/table/data-table';
import {
  columns,
  TeacherColumns,
} from '@/components/school/teacher/table/columns';
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
import { useMemo } from 'react';

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
  const search = useDebounce(searchTerm.length > 1 ? searchTerm : '', 400);

  const { data, isPending } = useGetSchoolTeachersQuery(
    {
      input: {
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

  const teacherData: TeacherColumns[] = useMemo(
    () =>
      data?.getSchoolTeachers?.data?.map((t) => ({
        id: t?.id ?? '',
        firstname: t.user?.profile?.firstname || '',
        lastname: t.user?.profile?.lastname || '',
        email: t.user?.email || '',
        phoneNumber: t.user?.phoneNumber || '',
        photo: t.user?.profile?.photo ?? undefined,
        specialization: t.specialization ? [t.specialization] : [],
        gender: t?.user?.profile?.gender as Gender,
        diploma: t?.diploma ?? '',
        assignments:
          t.assignments?.flatMap((ass) =>
            ass?.classSubjects?.group?.classes?.map((c) => ({
              class: c,
              subject: ass?.classSubjects?.subject ?? undefined,
            })),
          ) ?? [],
        status: t.isActive || false,
        weeklyHours: t?.weeklyHours ?? 0,
      })) || [],
    [data],
  );

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
