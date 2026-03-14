import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import * as React from 'react';
import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { SubjectColumns } from '@/components/school/subject/table/columns';
import { useDeleteSubjectsMutation, useQueryClient } from '@stackschool/ui';
import { toast } from 'sonner';
import { AppAlertDialog } from '@/components/app-alert-dialog';

export function SubjectTableAction({ row }: { row: Row<SubjectColumns> }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useDeleteSubjectsMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolSubjects'] });
    },
  });

  const handleDelete = async () => {
    const promise = mutateAsync({
      subjectIds: row.original.id,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        if (data?.deleteSubjects?.ok) {
          return (
            data.deleteSubjects?.message || 'Matière supprimer avec succès'
          );
        } else {
          throw new Error(
            data?.deleteSubjects?.message ||
              'Erreur lors de la suppression de la matière',
          );
        }
      },
      error: (err: any) => {
        return err?.message;
      },
      toasterId: 'dashboard',
    });
    setOpenDeleteDialog(false);
  };
  return (
    <div className="w-full flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Ouvrez le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => console.log('Modifier')}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Copy')}>
            Copier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            variant="destructive"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppAlertDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title={'Êtes-vous absolument sûr ?'}
        description="Cette action est irréversible. Elle supprimera définitivement cette matière et toutes les données associées de l'école."
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        variant="destructive"
      />
    </div>
  );
}
