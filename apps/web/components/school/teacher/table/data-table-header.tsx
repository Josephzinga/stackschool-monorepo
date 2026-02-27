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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteSelectedCount } from '@/components/school/delete-selected-count';

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
    <div className="flex flex-col gap-4 sm:gap-4">
      <div className="flex justify-between w-full ">
        {/*  PARTIE FILTRAGE */}
        <div className="flex justify-between h-10 gap-2 sm:gap-4">
          {selectedCount > 0 ? (
            <DeleteSelectedCount
              selectedCount={selectedCount}
              onDelete={setShowDeleteAlert}
              onClose={setRowSelection}
            />
          ) : (
            <>
              <div className="relative h-full w-60 sm:w-72">
                <Input
                  placeholder="Rechercher un enseignant..."
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
              {/*  Button filtre */}
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

              {/* Menu Affichage Colonnes */}
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
                  {TEACHER_COLUMNS.map((col) => (
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
        <Button
          onClick={() => setOpen(true)}
          className="gap-3 w-14 sm:w-30 h-full md:w-60"
        >
          <Plus className="h-8 w-8" />
          <span className="hidden sm:block font-poppins font-semibold">
            Ajouter
          </span>
        </Button>
        <TeacherDialog open={open} setOpen={setOpen} />
      </div>

      {showFilters && !selectedCount && <TeacherFilters />}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer {selectedCount} enseignant(s) ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les données associées (cours,
              notes) seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isPending}
            >
              {isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
