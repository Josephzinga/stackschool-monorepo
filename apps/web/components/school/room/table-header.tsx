'use client';

import DataHeaderInput from '@/components/school/data-filters';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { Plus } from 'lucide-react';
import * as React from 'react';

const ROOM_COLUMNS = [
  { id: 'name', label: 'Sale' },
  { id: 'capacity', label: 'Place' },
  { id: 'type', label: 'Type' },
  { id: 'class', label: 'Classe occupé' },
  { id: 'code', label: 'Code' },
];
export function RoomTableHeader() {
  const [searchTerm, setSearchTerm] = useQueryState('search');
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

      <Button className="w-full sm:w-40">
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="sm:hidden">Ajouter</span>
        <span className="hidden sm:inline font-medium">Ajouter une salle</span>
      </Button>
    </div>
  );
}
