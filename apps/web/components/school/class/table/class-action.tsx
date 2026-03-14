'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { ClassData } from '@/components/school/class/table/columns';
import ClassDialog from '@/components/school/class/table/class-dialog';
import { useState } from 'react';
import { useDeleteClassesMutation, useUserStore } from '@stackschool/ui';
import { toast } from 'sonner';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';

export default function ClassAction({ row }: { row: Row<ClassData> }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const { currentSchool } = useUserStore();
  const queryClient = useQueryClient();

  const { mutateAsync } = useDeleteClassesMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
    },
  });

  const handleDelete = async () => {
    const promise = mutateAsync({
      classIds: row.original.id,
      schoolId: currentSchool?.id!,
    });
    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        if (data.deleteClasses?.ok) {
          return data.deleteClasses.message || 'Suppression réussi avec succée';
        }
        throw new Error(
          data.deleteClasses?.message || 'Erreur lors de la suppression',
        );
      },
      error: (err) => {
        return err?.message;
      },
      toasterId: 'dashboard',
    });
    setOpenAlert(false);
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
            <span className="sr-only">Ouvrez le menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copier ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Voir détails</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenAlert(true)}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClassDialog
        initialValues={row.original}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />

      <AppAlertDialog
        open={openAlert}
        onOpenChange={setOpenAlert}
        onConfirm={handleDelete}
        description="Cette action vas supprimer cette classe et tous le donnée correspondente"
        title="Etes vous sur de cette action ?"
      />
    </div>
  );
}
