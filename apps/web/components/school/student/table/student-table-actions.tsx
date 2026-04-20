import { Row } from '@tanstack/react-table';
import { StudentColumns } from '@/components/school/student/table/columns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import { StudentDialog } from '@/components/school/student/table/student-dialog';
import * as React from 'react';
import { useState } from 'react';
import { useDeleteStudentsMutation, useUserStore } from '@stackschool/ui';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { AppAlertDialog } from '@/components/app-alert-dialog';

export function StudentTableActions({ row }: { row: Row<StudentColumns> }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { currentSchool } = useUserStore();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useDeleteStudentsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
    },
  });

  const handleDelete = async () => {
    try {
      const promise = mutateAsync({
        studentIds: [row.original?.id?.toString()],
        schoolId: currentSchool?.id!,
      });

      toast.promise(promise, {
        loading: 'Suppression en cours...',
        success: (data) => {
          return data.deleteStudents?.ok
            ? data.deleteStudents?.message || 'Eleve supprimé avec succès'
            : 'Erreur lors de la suppression';
        },
        error: (error) => {
          return error?.message || 'Erreur lors de la suppression';
        },
        toasterId: 'dashboard',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
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

      {openDialog && (
        <StudentDialog
          open={openDialog}
          setOpen={setOpenDialog}
          studentId={row.original.id?.toString()}
        />
      )}
      {openDeleteDialog && (
        <AppAlertDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title={'Êtes-vous absolument sûr ?'}
          description="Cette action est irréversible. Elle supprimera définitivement cet élève et toutes les données associées de l'école."
          onConfirm={handleDelete}
          isLoading={isPending}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      )}
    </div>
  );
}
