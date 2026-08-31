'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { DataTable } from '@/components/lists/parent/table/data-table';
import { useGetSchoolParentsQuery, useUserStore } from '@stackschool/ui';
import {
  parseAsInteger,
  parseAsString,
  SearchParams,
  useQueryStates,
} from 'nuqs';
import { columns, ParentColumn } from '@/components/lists/parent/table/column';
import { DataTableHeader } from '@/components/lists/parent/table/data-table-header';
import { TableProvider } from '@/components/lists/parent/table/table-provider';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function ParentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <TableProvider>
      <ParentView />
    </TableProvider>
  );
}
function ParentView() {
  const search = useSearchParams();
  const searchTerm = search.get('search');
  const [pagination, setPagination] = useQueryStates({
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(10),
  });

  const [filter, setFilter] = useQueryStates({
    studentId: parseAsString.withDefault(''),
    payementStatus: parseAsString.withDefault(''),
  });

  const { currentSchool } = useUserStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

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

  const parentsData: ParentColumn[] | undefined = useMemo(() => {
    return (
      data?.getSchoolParents?.data?.map((parent) => ({
        id: parent?.id!,
        firstname: parent?.user?.profile?.firstname ?? '',
        lastname: parent.user?.profile?.lastname ?? '',
        phoneNumber: parent?.user?.phoneNumber ?? '',
        profession: parent.profession ?? '',
        students:
          parent.parentStudent?.map((s) => ({
            id: s?.student?.id!,
            firstname: s?.student?.user?.profile?.firstname ?? '',
            lastname: s?.student?.user?.profile?.lastname ?? '',
            relationType: 'MOTHER',
            classe: s?.student?.schoolClass,
          })) || [],
      })) || []
    );
  }, [data]);

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
}
