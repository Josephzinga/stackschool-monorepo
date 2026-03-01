'use client';

import { Input } from '@/components/ui/input';
import { useTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Filter, Plus, Settings2, X } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteSelectedCount } from '@/components/school/delete-selected-count';
import { AppAlertDialog } from '@/components/app-alert-dialog';

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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:flex-initial">
                  <div className="relative flex-1 lg:w-96">
                    <Input
                      placeholder="Rechercher un enseignant..."
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
                        className="w-48 sm:w-56"
                      >
                        <DropdownMenuLabel className="text-xs sm:text-sm">
                          Colonnes visibles
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-64 overflow-y-auto">
                          {TEACHER_COLUMNS.map((col) => (
                            <DropdownMenuCheckboxItem
                              key={col.id}
                              checked={columnVisibility[col.id] !== false}
                              onCheckedChange={(checked) =>
                                toggleColumn(col.id, checked)
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
