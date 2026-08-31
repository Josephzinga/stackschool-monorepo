import { AttendanceTableHeader } from '@/components/lists/attendance/table/table-header';
import { AttendanceTable } from '@/components/lists/attendance/table/manual-attendance-table';

function AttendancePage() {
  return (
    <div className="h-full w-full flex justify-center py-4 px-4 md:px-6">
      <div className="flex flex-col gap-4 w-full max-w-7xl">
        <AttendanceTableHeader />
        <AttendanceTable />
      </div>
    </div>
  );
}

export default AttendancePage;
