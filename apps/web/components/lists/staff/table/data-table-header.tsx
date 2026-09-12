'use client';

import DataHeaderInput from '@/components/lists/data-filters';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useStaffTable } from './table-provider';

const STAFF_COLUMNS = [
  { id: 'info', label: 'Personnel' },
  { id: 'department', label: 'Département' },
  { id: 'position', label: 'Poste' },
  { id: 'hireDate', label: "Date d'embauche" },
  { id: 'salary', label: 'Salaire' },
  { id: 'status', label: 'Statut' },
];

export function StaffDataTableHeader() {
  const {
    searchTerm,
    setSearchTerm,
    columnVisibility,
    setColumnVisibility,
    setDialogOpen,
  } = useStaffTable();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <DataHeaderInput
        inputPlaceholder="Rechercher un membre du personnel"
        search={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onShowFilterChange={setShowFilters}
        hasActiveFilters={false}
        columns={STAFF_COLUMNS}
        columnVisibility={columnVisibility}
        onToggleColumn={(columnId, isVisible) =>
          setColumnVisibility((current) => ({
            ...current,
            [columnId]: isVisible,
          }))
        }
      />
      <Button onClick={() => setDialogOpen(true)}>Ajouter un membre</Button>
    </div>
  );
}
