import { Button } from '@/components/ui/button';
import { Filter, Plus, Settings2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useState } from 'react';
import { useTable } from '@/components/school/student/table/table-provider';
import { DeleteSelectedCount } from '@/components/school/delete-selected-count';
import { useDeleteStudentsMutation, useUserStore } from '@stackschool/ui';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StudentDialog } from '@/components/school/student/table/student-dialog';
import StudentFilter from '@/components/school/student/table/table-filter';
import { useQueryClient } from '@tanstack/react-query';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { toast } from 'sonner';

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
  } = useTable();
  const { currentSchool } = useUserStore();
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
    if (!currentSchool?.id) return;

    const studentIds = Object.keys(rowSelection);

    const promise = mutateAsync({
      schoolId: currentSchool.id,
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:flex-initial">
                  <div className="relative flex-1 lg:w-96">
                    <Input
                      placeholder="Rechercher un élève..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="pr-8 w-full"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchTerm('')}
                        className="absolute h-7 w-7 top-1/2 -translate-y-1/2 right-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bouton Filtres */}
                    <Button
                      variant={
                        showFilters || hasActiveFilters
                          ? 'secondary'
                          : 'outline'
                      }
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-1.5 sm:gap-2 flex-1 h-10 sm:flex-initial"
                    >
                      <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sm:hidden">Filtres</span>
                      <span className="hidden sm:inline">Filtres</span>
                      {hasActiveFilters && (
                        <span className="ml-0.5 sm:ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
                      )}
                    </Button>

                    {/* Bouton Affichage */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="gap-1.5 sm:gap-2 h-10 flex-1 sm:flex-initial"
                        >
                          <Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="sm:hidden">Colonnes</span>
                          <span className="hidden sm:inline">Affichage</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-48 sm:w-56 bg-accent/70 backdrop-blur-lg"
                      >
                        <DropdownMenuLabel className="text-xs sm:text-sm">
                          Colonnes visibles
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-64 overflow-y-auto">
                          {STUDENT_COLUMNS.map((col) => (
                            <DropdownMenuCheckboxItem
                              key={col.id}
                              checked={columnVisibility[col.id] !== false}
                              onCheckedChange={(checked) =>
                                toggleColumns(col.id, checked)
                              }
                              className="text-xs sm:text-sm"
                            >
                              {col.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

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
        {showFilters && !selectedCount && (
          <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <StudentFilter />
          </div>
        )}

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
