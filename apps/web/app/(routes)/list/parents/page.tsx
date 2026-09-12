'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { DataTable } from '@/components/lists/parent/table/data-table';
import { useGetSchoolParentsQuery, useUserStore } from '@stackschool/ui';
import { SearchParams } from 'nuqs';
import { columns, ParentData } from '@/components/lists/parent/table/column';
import { DataTableHeader } from '@/components/lists/parent/table/data-table-header';
import {
  TableProvider,
  useParentTable,
} from '@/components/lists/parent/table/table-provider';
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
  const { searchTerm, pagination, filters } = useParentTable();

  const { currentSchool } = useUserStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data, isLoading } = useGetSchoolParentsQuery({
    filter: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      searchTerm: debouncedSearchTerm,
      studentId: filters?.studentId,
    },
  });

  const parentsData: ParentData[] | undefined = useMemo(() => {
    return (
      data?.getSchoolParents?.data?.map((parent) => ({
        id: parent?.id!,
        profile: {
          firstName: parent.schoolProfile?.firstName ?? '',
          lastName: parent.schoolProfile?.lastName ?? '',
          avatarUrl: parent.schoolProfile?.avatarUrl ?? undefined,
        },
        gender: parent.schoolProfile?.gender,
        userId: parent.member?.user?.id,
        contact: {
          phoneNumber: parent.member?.user?.phoneNumber ?? '',
          email: parent.member?.user?.email ?? '',
        },
        profession: parent.profession ?? '',
        address: parent.schoolProfile?.address ?? '',
        students:
          parent.parentStudent?.map((s) => ({
            id: s?.student?.id!,
            firstName: s?.student?.schoolProfile?.firstName ?? '',
            lastName: s?.student?.schoolProfile?.lastName ?? '',
            avatarUrl: s?.student?.schoolProfile?.avatarUrl ?? undefined,
            relationType: s?.relationType!,
            classe: s?.student?.schoolClass!,
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
        meta={meta!}
        isLoading={isLoading}
      />
    </div>
  );
}
