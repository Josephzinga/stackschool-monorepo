'use client';

import { useParentTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { useUserStore } from '@stackschool/ui';
import { toast } from 'sonner';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import DataHeaderInput from '@/components/lists/data-filters';
import { DeleteSelectedCount } from '@/components/lists/delete-selected-count';
import { TableFilter } from '@/components/lists/parent/table/table-filter';

const PARENT_COLUMNS = [
  { id: 'info', label: 'Parents' },
  { id: 'phoneNumber', label: 'Téléphone' },
  { id: 'profession', label: 'Profession' },
  { id: 'address', label: 'Adresse' },
  { id: 'students', label: 'Enfants' },
];

export function DataTableHeader() {
  const { searchTerm, setSearchTerm } = useParentTable();
  const {
    filters,
    setFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    setDialogOpen,
    setIsUpdate,
  } = useParentTable();
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { currentSchool } = useUserStore();

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
  const selectedCount = Object.keys(rowSelection).length;

  const handleBulkDelete = async () => {
    if (!currentSchool?.id) return;
    // Sera implémenté avec la mutation correspondante
    toast.info('La suppression en masse des parents sera bientôt disponible');
    setRowSelection({});
    setShowDeleteAlert(false);
  };

  const toggleColumn = (columnId: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };
  const handleClick = () => {
    setDialogOpen(true);
    setIsUpdate(false);
  };
  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      {/* PARTIE FILTRAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {selectedCount > 0 ? (
          <DeleteSelectedCount
            selectedCount={selectedCount}
            onDelete={() => setShowDeleteAlert(true)}
            onClose={() => setRowSelection({})}
          />
        ) : (
          <div className="w-full flex flex-col sm:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            <DataHeaderInput
              inputPlaceholder="Rechercher un parent..."
              onShowFilterChange={setShowFilters}
              hasActiveFilters={hasActiveFilters}
              search={searchTerm}
              showFilters={showFilters}
              onSearchChange={setSearchTerm}
              onToggleColumn={(data) => {}}
              columns={PARENT_COLUMNS}
              columnVisibility={columnVisibility}
            />

            {/* Bouton Ajouter  */}
            <Button
              onClick={handleClick}
              className="w-full sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-8 bg-linear-to-tr from-primary to-primary/50 hover:from-primary/90 hover:to-primary lg:ml-auto"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="lg:hidden">Ajouter</span>
              <span className="hidden lg:inline font-medium">
                Ajouter un Parent
              </span>
            </Button>
          </div>
        )}
      </div>

      {showFilters && !selectedCount && <TableFilter />}

      {showDeleteAlert && (
        <AppAlertDialog
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
          title={`Supprimer ${selectedCount} parent(s) ?`}
          description="Cette action est irréversible. Les liens avec les élèves seront également supprimés."
          onConfirm={handleBulkDelete}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      )}
    </div>
  );
}
