'use client';

import { useGetSchoolClassesQuery } from '@stackschool/ui';
import { DataTable } from '@/components/school/class/table/data-table'; // À créer ou adapter
import { ClassData, columns } from '@/components/school/class/table/columns';
import { useDebounce } from '@/hooks/useDebounce';
import DataTableHeader from '@/components/school/class/table/data-table-header';
import { useClassTable } from '@/components/school/class/table/table-provider';
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
          id: c.supervisor?.user?.id,
          profile: {
            id: c.supervisor?.user?.profile?.id,
            firstname: c.supervisor?.user?.profile?.firstname ?? '',
            lastname: c.supervisor?.user?.profile?.lastname ?? '',
            photo: c.supervisor?.user?.profile?.photo ?? undefined,
          },
        },
        teachers:
          c.teachers?.map((t) => ({
            id: t?.id ?? '',
            firstname: t?.user?.profile?.firstname ?? '',
            lastname: t?.user?.profile?.lastname ?? '',
          })) || [],
        subjects: c.subjects,
        _count: {
          students:
            (c?._count?.students?.male || 0) +
            (c?._count?.students?.female || 0),
          subjects: c._count?.subjects || 0,
          teachers: c._count?.teachers || 0,
        },
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
