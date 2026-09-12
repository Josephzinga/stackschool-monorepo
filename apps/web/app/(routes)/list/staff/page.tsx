'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { useGetSchoolStaffQuery, useUserStore } from '@stackschool/ui';
import { StaffDataTable } from '@/components/lists/staff/table/data-table';
import { StaffDataTableHeader } from '@/components/lists/staff/table/data-table-header';
import { columns, StaffData } from '@/components/lists/staff/table/columns';
import {
  StaffTableProvider,
  useStaffTable,
} from '@/components/lists/staff/table/table-provider';

export default function StaffPage() {
  return (
    <StaffTableProvider>
      <StaffView />
    </StaffTableProvider>
  );
}

function StaffView() {
  const { searchTerm, pagination } = useStaffTable();
  const { currentSchool } = useUserStore();
  const search = useDebounce(searchTerm, 400);

  const { data, isPending } = useGetSchoolStaffQuery({
    input: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      searchTerm: search,
    },
  });
  const staffData: StaffData[] =
    data?.getSchoolStaff.data.map((staff) => ({
      id: staff.id,
      profile: {
        firstName: staff.SchoolProfile?.firstName ?? '',
        lastName: staff.SchoolProfile?.lastName ?? '',
        avatarUrl: staff.SchoolProfile?.avatarUrl ?? undefined,
      },
      contact: {
        email: staff.schoolUser?.user?.email ?? '',
        phoneNumber: staff.schoolUser?.user?.phoneNumber ?? '',
      },
      department: staff.department ?? undefined,
      position: staff.position,
      hireDate: staff?.hireDate ?? undefined,
      salary: staff?.salary ?? undefined,
      status: true,
    })) ?? [];

  return (
    <div className="flex h-full flex-col gap-3 p-3 md:gap-4 md:p-6">
      <StaffDataTableHeader />
      <StaffDataTable
        columns={columns}
        data={staffData}
        meta={data?.getSchoolStaff.meta}
        isLoading={isPending}
      />
    </div>
  );
}
