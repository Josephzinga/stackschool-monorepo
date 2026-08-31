'use client';

import { DataTable } from '@/components/lists/teacher/table/data-table';
import {
  columns,
  TeachersData,
} from '@/components/lists/teacher/table/columns';
import {
  TableProvider,
  useTeacherTable,
} from '@/components/lists/teacher/table/table-provider';
import { DataTableHeader } from '@/components/lists/teacher/table/data-table-header';
import { useGetSchoolTeachersQuery, useUserStore } from '@stackschool/ui';
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
  const { pagination, searchTerm, filters } = useTeacherTable();
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

  const teacherData: TeachersData[] = useMemo(
    () =>
      data?.getSchoolTeachers?.data?.map((t) => ({
        id: t?.id ?? '',
        contact: {
          email: t.schoolUser?.user?.email || '',
          phoneNumber: t.schoolUser?.user?.phoneNumber || '',
        },
        profile: {
          firstName: t.schoolProfile?.firstName || '',
          lastName: t.schoolProfile?.lastName || '',
          avatarUrl: t.schoolProfile?.avatarUrl ?? undefined,
        },

        specialization: t.specialization ? [t.specialization] : [],
        gender: t?.schoolProfile?.gender,
        diploma: t?.diploma ?? '',
        assignments:
          t.assignments?.flatMap((ass) =>
            ass?.classSubject?.group?.classes?.map((c) => ({
              class: c,
              subject: ass?.classSubject?.subject ?? undefined,
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
