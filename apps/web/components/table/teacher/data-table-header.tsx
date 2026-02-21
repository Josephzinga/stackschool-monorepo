'use client';

import { Input } from '@/components/ui/input';
import { useTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Filter, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { TeacherFilters } from './teacher-filters';
import { TeacherDialog } from './teacher-dialog';
import { useDeleteTeachersMutation, useUserStore } from '@stackschool/ui';
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

export function DataTableHeader() {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    rowSelection,
    setRowSelection,
  } = useTable();
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { currentSchool } = useUserStore();

  const { mutateAsync, isPending } = useDeleteTeachersMutation();

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
      success: `${teacherIds.length} professeurs supprimés`,
      error: 'Erreur lors de la suppression',
    });

    try {
      await promise;
      setRowSelection({}); // Reset sélection
      setShowDeleteAlert(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
              <div className="relative h-10 w-72">
                <Input
                  placeholder="Rechercher un enseignant..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-full pr-8"
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
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                )}
              </Button>
            </>
          )}
        </div>

        {/* Remplacement du bouton simple par le Dialog */}
        <TeacherDialog />
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
