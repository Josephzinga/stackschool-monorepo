'use client';

import { RoomDataTable } from '@/components/lists/room/data-table';
import { columns, RoomColumns } from '@/components/lists/room/columns';
import { useGetSchoolRoomQuery } from '@stackschool/ui';
import { useState } from 'react';
import { RoomFormDialog } from '@/components/lists/room/room-form-dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { RoomTableHeader } from '@/components/lists/room/table-header';

export default function RoomsPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const search = useDebounce(searchTerm, 400);

  const { data, isPending } = useGetSchoolRoomQuery({
    filter: {
      limit: 10,
      searchTerm: search,
    },
  });

  const roomData: RoomColumns[] = data?.getSchoolRooms?.data || [];
  return (
    <div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <RoomTableHeader />
      <RoomDataTable
        data={roomData}
        meta={data?.getSchoolRooms?.meta ?? undefined}
        columns={columns}
        isLoading={false}
      />
      <div className="flex justify-between">
        <RoomFormDialog open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
