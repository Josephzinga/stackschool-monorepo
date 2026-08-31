'use client';

import { Input } from '@/components/ui/input';
import { useTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Button as AnimateButton } from '@/components/animate-ui/components/buttons/button';
import { Filter, Plus, Settings2, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { useUserStore } from '@stackschool/ui';
import { toast } from 'sonner';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { parseAsString, useQueryState } from 'nuqs';
import { ParentDialog } from '@/components/lists/parent/parent-dialog';

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
  } = useTable();
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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
            <>
              <div className="relative h-full w-60 sm:w-72">
                <Input
                  placeholder="Rechercher un parent..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className=" pr-8"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm('')}
                    className="absolute h-8 w-8 top-1/2 -translate-y-1/2 right-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant={
                  showFilters || hasActiveFilters ? 'secondary' : 'outline'
                }
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-full"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:block">Filtres</span>
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 h-full">
                    <Settings2 className="h-4 w-4" />
                    <span className="hidden sm:block">Affichage</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {PARENT_COLUMNS.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={columnVisibility[col.id] !== false}
                      onCheckedChange={(checked) =>
                        toggleColumn(col.id, checked)
                      }
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        <AnimateButton
          onClick={() => setDialogOpen(true)}
          className="gap-3 w-14 sm:w-30 h-full md:w-60 cursor-pointer"
        >
          <Plus className="h-8 w-8" />
          <span className="hidden sm:block font-poppins font-semibold">
            Ajouter
          </span>
        </AnimateButton>
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
      {dialogOpen && (
        <ParentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  );
}
