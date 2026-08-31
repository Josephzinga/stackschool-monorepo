import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { useStudentTable } from '@/components/lists/student/table/table-provider';
import { DeleteSelectedCount } from '@/components/lists/delete-selected-count';
import { useDeleteStudentsMutation } from '@stackschool/ui';
import { StudentDialog } from '@/components/lists/student/table/student-dialog';
import StudentFilter from '@/components/lists/student/table/table-filter';
import { useQueryClient } from '@tanstack/react-query';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { toast } from 'sonner';
import DataHeaderInput from '@/components/lists/data-filters';

const STUDENT_COLUMNS = [
  { id: 'info', label: 'Élèves' },
  { id: 'matricule', label: 'Matricule' },
  { id: 'className', label: 'Classe' },
  { id: 'section', label: 'Section' },
  { id: 'level', label: 'Niveau' },
  { id: 'enrollmentYear', label: 'Inscription' },
  { id: 'status', label: 'Statut' },
];

export function DataTableHeader() {
  const {
    rowSelection,
    searchTerm,
    filters,
    setSearchTerm,
    columnVisibility,
    setColumnVisibility,
    setRowSelection,
  } = useStudentTable();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);
  const selectedCount = Object.values(rowSelection).length;
  const queryClient = useQueryClient();

  const toggleColumns = (columnId: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  const { mutateAsync, isPending } = useDeleteStudentsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
    },
  });

  const handleBulkDelete = async () => {
    const studentIds = Object.keys(rowSelection);

    const promise = mutateAsync({
      studentIds,
      soft: true,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        return data.deleteStudents?.ok
          ? data.deleteStudents?.message ||
              `${studentIds.length} élève(s) supprimé(s)`
          : 'Erreur lors de la suppression';
      },
      error: (error) => {
        return error?.message || 'Erreur lors de la suppression';
      },
      toasterId: 'dashboard',
    });

    try {
      await promise;
      setRowSelection({});
      setShowDeleteAlert(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        {/* PARTIE FILTRAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {selectedCount > 0 ? (
            <DeleteSelectedCount
              selectedCount={selectedCount}
              onDelete={() => setShowDeleteAlert(true)}
              onClose={() => setRowSelection({})}
            />
          ) : (
            <>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <DataHeaderInput
                  inputPlaceholder="Rechercher un élève..."
                  onShowFilterChange={setShowFilters}
                  hasActiveFilters={hasActiveFilters}
                  search={searchTerm}
                  showFilters={showFilters}
                  onSearchChange={setSearchTerm}
                  onToggleColumn={toggleColumns}
                  columns={STUDENT_COLUMNS}
                  columnVisibility={columnVisibility}
                />

                {/* Bouton Ajouter  */}
                <Button
                  onClick={() => setOpen(true)}
                  className="w-full sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-10 bg-linear-to-tr from-primary to-primary/50 hover:from-primary/90 hover:to-primary lg:ml-auto"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-medium">
                    Ajouter un élève
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Filtres étendus */}
        {showFilters && !selectedCount && <StudentFilter />}

        <StudentDialog open={open} setOpen={setOpen} />

        <AppAlertDialog
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
          title={`Supprimer ${selectedCount} élève(s) ?`}
          description="Cette action archivera les élèves sélectionnés. Ils ne pourront plus accéder à la plateforme."
          onConfirm={handleBulkDelete}
          isLoading={isPending}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      </div>
    </div>
  );
}
