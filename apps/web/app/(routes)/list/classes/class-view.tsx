'use client';

import { useGetSchoolClassesQuery } from '@stackschool/ui';
import { DataTable } from '@/components/school/class/table/data-table'; // À créer ou adapter
import { columns } from '@/components/school/class/table/columns';
import { useDebounce } from '@/hooks/useDebounce';
import DataTableHeader from '@/components/school/class/table/data-table-header';
import { useClassTable } from '@/components/school/class/table/table-provider';
import { useSearchParams } from 'next/navigation';

export function ClassView() {
  const { searchTerm, pagination, setPagination, filters } = useClassTable();
  const debouncedSearch = useDebounce(500, searchTerm);
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

  const classesData =
    data?.getSchoolClasses?.data?.map((c) => ({
      ...c,
      supervisor: {
        id: c.supervisor?.user?.id,
        email: c.supervisor?.user?.email ?? null,
        username: c.supervisor?.user?.username ?? '',
        phoneNumber: c.supervisor?.user?.phoneNumber ?? '',
        profile: {
          id: c.supervisor?.user?.profile?.id,
          firstname: c.supervisor?.user?.profile?.firstname ?? '',
          lastname: c.supervisor?.user?.profile?.lastname ?? '',
          photo: c.supervisor?.user?.profile?.photo ?? undefined,
        },
      },
      _count: {
        students:
          (c?._count?.students?.male || 0) + (c?._count?.students?.female || 0),
        subjects: c._count?.subjects || 0,
        teachers: c._count?.teachers || 0,
      },
    })) || [];
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
