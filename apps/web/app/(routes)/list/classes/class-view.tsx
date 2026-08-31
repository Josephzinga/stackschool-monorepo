'use client';

import { useGetSchoolClassesQuery } from '@stackschool/ui';
import { DataTable } from '@/components/lists/class/table/data-table'; // À créer ou adapter
import { ClassData, columns } from '@/components/lists/class/table/columns';
import { useDebounce } from '@/hooks/useDebounce';
import DataTableHeader from '@/components/lists/class/table/data-table-header';
import { useClassTable } from '@/components/lists/class/table/table-provider';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function ClassView() {
  const { searchTerm, pagination, setPagination, filters } = useClassTable();
  const debouncedSearch = useDebounce(searchTerm, 400);
  const searchParams = useSearchParams();
  const teacherId = searchParams.get('teacherId');

  const { data, isLoading } = useGetSchoolClassesQuery({
    input: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      searchTerm: debouncedSearch,
      teacherId,
      section: filters?.section,
      level: filters?.level,
    },
  });

  const classesData: ClassData[] = useMemo(
    () =>
      data?.getSchoolClasses?.data?.map((c) => ({
        ...c,
        supervisor: {
          id: c.supervisor?.id,
          profile: {
            id: c.supervisor?.schoolProfile?.id ?? '',
            firstName: c.supervisor?.schoolProfile?.firstName ?? '',
            lastName: c.supervisor?.schoolProfile?.lastName ?? '',
            avatarUrl: c.supervisor?.schoolProfile?.avatarUrl ?? undefined,
          },
        },
        count: {
          students: (c.studentCount?.male || 0) + (c.studentCount?.female || 0),
        },
        subjects: c.group?.classSubjects?.map((s) => s?.subject),
      })) || [],
    [data],
  );

  const meta = data?.getSchoolClasses.meta;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-4">
      <DataTableHeader />
      <DataTable
        columns={columns}
        data={classesData}
        meta={meta}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}
