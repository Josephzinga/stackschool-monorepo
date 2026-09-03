'use client';

import { useParentTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { useUserStore } from '@stackschool/ui';
import { toast } from 'sonner';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { parseAsString, useQueryState } from 'nuqs';
import DataHeaderInput from '@/components/lists/data-filters';

const PARENT_COLUMNS = [
  { id: 'info', label: 'Parents' },
  { id: 'phoneNumber', label: 'Téléphone' },
  { id: 'profession', label: 'Profession' },
  { id: 'address', label: 'Adresse' },
  { id: 'students', label: 'Enfants' },
];

export function DataTableHeader() {
  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  );
  const {
    filters,
    setFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    setDialogOpen,
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

  return (
    <div className="flex flex-col gap-4 sm:gap-4">
      <div className="flex justify-between w-full ">
        <div className="flex justify-between h-10 gap-2 sm:gap-4">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-2 bg-red-50 text-red-900 px-3 py-2 rounded-md border border-red-100">
              <span className="text-sm font-medium">
                {selectedCount} sélectionné(s)
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-900 hover:bg-red-100"
                onClick={() => setRowSelection({})}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-red-200 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-red-700 hover:bg-red-100 hover:text-red-900 text-xs font-medium"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          ) : (
            <DataHeaderInput
              inputPlaceholder="Rechercher un parent"
              onShowFilterChange={setShowFilters}
              hasActiveFilters={hasActiveFilters}
              search={searchTerm}
              showFilters={showFilters}
              onSearchChange={setSearchTerm}
              columns={PARENT_COLUMNS}
              columnVisibility={columnVisibility}
              onToggleColumn={toggleColumn}
            />
          )}
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-3 w-14 h-8! sm:w-30 md:w-60 cursor-pointer"
        >
          <Plus className="h-8 w-8" />
          <span className="hidden sm:block font-poppins font-semibold">
            Ajouter
          </span>
        </Button>
      </div>

      {showFilters && !selectedCount && (
        <div className="p-4 bg-slate-50 rounded-lg border">
          {/* Composant de filtre parent à venir */}
          <p className="text-sm text-muted-foreground">
            Filtres avancés des parents bientôt disponibles
          </p>
        </div>
      )}

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
