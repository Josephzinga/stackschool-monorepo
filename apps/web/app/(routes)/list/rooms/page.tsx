'use client';

import { RoomDataTable } from '@/components/school/room/data-table';
import { columns, RoomColumns } from '@/components/school/room/columns';
import { Button } from '@/components/ui/button';
import { useGetSchoolRoomQuery } from '@stackschool/ui';
import { useState } from 'react';
import DataHeaderInput from '@/components/school/data-filters';
import { RoomFormDialog } from '@/components/school/room/room-form-dialog';
import { useDebounce } from '@/hooks/useDebounce';

export default function RoomsPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const search = useDebounce(300, searchTerm);
  const { data, isPending } = useGetSchoolRoomQuery({
    filter: {
      limit: 10,
      searchTerm: search,
    },
  });

  const roomData: RoomColumns[] = data?.getSchoolRooms?.data || [];
  return (
    <div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <div className="flex justify-between">
        <DataHeaderInput
          hasActiveFilters={false}
          showFilters={false}
          search={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <Button onClick={() => setOpen(true)} className="font-semibold">
          Crée une salle
        </Button>

        <RoomFormDialog open={open} onOpenChange={setOpen} />
      </div>
      <RoomDataTable
        data={roomData}
        meta={data?.getSchoolRooms?.meta ?? undefined}
        columns={columns}
        isLoading={isPending}
      />
    </div>
  );
}
