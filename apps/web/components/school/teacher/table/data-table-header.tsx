'use client';

import { useTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { TeacherFilters } from './teacher-filters';
import { TeacherDialog } from './teacher-dialog';
import {
  useDeleteTeachersMutation,
  useQueryClient,
  useUserStore,
} from '@stackschool/ui';
import { toast } from 'sonner';
import { DeleteSelectedCount } from '@/components/school/delete-selected-count';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import DataHeaderInput from '@/components/school/data-filters';

// Liste des colonnes contrôlables
const TEACHER_COLUMNS = [
  { id: 'info', label: 'Enseignant' },
  { id: 'speciality', label: 'Spécialité' },
  { id: 'phoneNumber', label: 'Téléphone' },
  { id: 'status', label: 'Statut' },
  { id: 'classes', label: 'Classes' },
];

export function DataTableHeader() {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
  } = useTable();
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentSchool } = useUserStore();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useDeleteTeachersMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['GetSchoolTeachers'],
      });
    },
  });

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
  const selectedCount = Object.keys(rowSelection).length;

  const handleBulkDelete = async () => {
    if (!currentSchool?.id) return;

    const teacherIds = Object.keys(rowSelection);

    const promise = mutateAsync({
      teacherIds,
      schoolId: currentSchool.id,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: async (data) => {
        if (data.deleteTeachers?.ok) {
          return `${teacherIds.length} professeurs supprimé`;
        } else {
          console.error(data.deleteTeachers?.message);
          throw new Error(data.deleteTeachers?.message!);
        }
      },
      error: (error) => {
        return error.message;
      },
    });

    try {
      await promise;
      setRowSelection({}); // Reset sélection
      setShowDeleteAlert(false);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleColumn = (columnId: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        {/* PARTIE FILTRAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {selectedCount > 0 ? (
            <DeleteSelectedCount
              selectedCount={selectedCount}
              onDelete={setShowDeleteAlert}
              onClose={setRowSelection}
            />
          ) : (
            <>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <DataHeaderInput
                  hasActiveFilters={hasActiveFilters}
                  showFilters={showFilters}
                  columns={TEACHER_COLUMNS}
                  columnVisibility={columnVisibility}
                  search={searchTerm}
                  onSearchChange={setSearchTerm}
                  onToggleColumn={toggleColumn}
                  onShowFilterChange={setShowFilters}
                />

                {/* Bouton Ajouter à droite sur lg */}
                <Button
                  onClick={() => setOpen(true)}
                  className="w-full sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-10 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary lg:ml-auto"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-medium">
                    Ajouter un enseignant
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
        {/* Filtres étendus */}
        {showFilters && !selectedCount && (
          <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <TeacherFilters />
          </div>
        )}
        {/* Dialog d'ajout d'enseignant */}
        <TeacherDialog open={open} setOpen={setOpen} />

        <AppAlertDialog
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
          isLoading={isPending}
          title={` Supprimer ${selectedCount} enseignant ${selectedCount > 1 ? 's' : ''} ?`}
          description="Cette action est irréversible. Les données associées (cours, notes) seront également supprimées."
          onConfirm={handleBulkDelete}
          cancelLabel="Annuler"
          confirmLabel="Supprimer"
        />
      </div>
    </div>
  );
}
