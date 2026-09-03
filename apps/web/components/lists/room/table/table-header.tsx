'use client';

import DataHeaderInput from '@/components/lists/data-filters';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RoomFormDialog } from '@/components/lists/room/room-form-dialog';
import { useRoomTable } from '@/components/lists/room/table/table-provider';

const ROOM_COLUMNS = [
  { id: 'name', label: 'Sale' },
  { id: 'capacity', label: 'Place' },
  { id: 'type', label: 'Type' },
  { id: 'class', label: 'Classe occupé' },
  { id: 'code', label: 'Code' },
];
export function RoomTableHeader() {
  const { searchTerm, setSearchTerm } = useRoomTable();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
      <DataHeaderInput
        columns={ROOM_COLUMNS}
        hasActiveFilters={false}
        inputPlaceholder="Rechercher une salle..."
        showFilters={false}
        search={searchTerm ?? undefined}
        onSearchChange={setSearchTerm}
      />

      <Button
        className="w-full sm:w-40 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="sm:hidden">Ajouter</span>
        <span className="hidden sm:inline font-medium">Ajouter une salle</span>
      </Button>

      {open && <RoomFormDialog open={open} onOpenChange={setOpen} />}
    </div>
  );
}
