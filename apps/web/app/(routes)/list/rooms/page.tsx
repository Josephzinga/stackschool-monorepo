'use client';

import { RoomDataTable } from '@/components/lists/room/table/data-table';
import { columns, RoomData } from '@/components/lists/room/table/columns';
import { useGetSchoolRoomQuery } from '@stackschool/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { RoomTableHeader } from '@/components/lists/room/table/table-header';
import {
  TableProvider,
  useRoomTable,
} from '@/components/lists/room/table/table-provider';

export default function RoomsPage() {
  return (
    <TableProvider>
      <RoomView />
    </TableProvider>
  );
}

function RoomView() {
  const { setPagination, searchTerm } = useRoomTable();
  const search = useDebounce(searchTerm, 400);

  const { data, isPending } = useGetSchoolRoomQuery({
    filter: {
      limit: 10,
      searchTerm: search,
    },
  });

  const roomData: RoomData[] = data?.getSchoolRooms?.data! || [];
  return (
    <div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <RoomTableHeader />
      <RoomDataTable
        data={roomData}
        meta={data?.getSchoolRooms?.meta ?? undefined}
        columns={columns}
        isLoading={isPending}
      />
    </div>
  );
}
