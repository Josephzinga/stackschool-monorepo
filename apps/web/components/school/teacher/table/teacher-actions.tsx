import { Row } from '@tanstack/react-table';
import { Teacher } from './columns';
import { useDeleteTeachersMutation, useUserStore } from '@stackschool/ui';
import { useQueryClient } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useState } from 'react';
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

export function TeacherActions({ row }: { row: Row<Teacher> }) {
  const teacherId = row.original.id;
  const { currentSchool } = useUserStore();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useDeleteTeachersMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolTeachers'] });
    },
  });

  const handleDelete = async () => {
    if (!currentSchool?.id) return;

    const promise = mutateAsync({
      teacherIds: [teacherId] as Array<string>,
      schoolId: currentSchool?.id!,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        return (
          data.deleteTeachers?.message || 'Professeur supprimé avec succès'
        );
      },
      error: 'Erreur lors de la suppression',
      toasterId: 'dashboard',
    });

    try {
      await promise;
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Ouvrez le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => console.log('Edit')}>
            Editer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Copy')}>
            Copier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} variant="destructive">
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement ce
              professeur et toutes les données associées de l'école.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              variant="destructive"
            >
              {isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
