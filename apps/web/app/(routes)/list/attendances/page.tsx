import React from 'react';
import { TableHeader } from '@/components/school/attendance/table/table-header';
import { AttendanceDashboard } from '@/app/(routes)/list/attendances/page1';

function Page() {
  return (
    <div className="h-full w-full flex justify-center py-4 px-4 md:px-6">
      <div className="flex flex-col gap-4 w-full max-w-7xl">
        <TableHeader />
        <AttendanceDashboard />
      </div>
    </div>
  );
}

export default Page;
