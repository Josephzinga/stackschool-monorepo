'use client';

import { useGetSchoolParentsQuery, useUserStore } from '@stackschool/ui';
import { useTable } from '@/components/school/parent/table/table-provider';
import { DataTableHeader } from '@/components/school/parent/table/data-table-header';
import { DataTable } from '@/components/school/parent/table/data-table';
import { columns, ParentColumn } from '@/components/school/parent/table/column';
import { useDebounce } from '@/hooks/useDebounce';
import { parseAsInteger, useQueryStates } from 'nuqs';

export const ParentView = () => {
  const [pagination, setPagination] = useQueryStates({
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(10),
  });
  const { currentSchool } = useUserStore();
  const { searchTerm, filters } = useTable(); // useTable from Parent TableProvider

  const debouncedSearchTerm = useDebounce(500, searchTerm);

  const { data, isLoading } = useGetSchoolParentsQuery(
    {
      filter: {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        searchTerm: debouncedSearchTerm,
      },
    },
    {
      enabled: !!currentSchool?.id,
    },
  );

  const parentsData: ParentColumn[] | undefined =
    data?.getSchoolParents?.data?.map((parent) => ({
      id: parent?.id,
      firstname: parent?.user?.profile?.firstname,
      lastname: parent.user?.profile?.lastname,
      profession: parent.profession,
      students: parent.students?.map((s) => ({
        firstname: s?.user?.profile?.firstname ?? '',
        lastname: s?.user?.profile?.lastname ?? '',
      })),
    })) || [];
  const meta = data?.getSchoolParents?.meta;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-4">
      <DataTableHeader />
      <DataTable
        columns={columns}
        data={parentsData || []}
        meta={meta}
        isLoading={isLoading}
      />
    </div>
  );
};
