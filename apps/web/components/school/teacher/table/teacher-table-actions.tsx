'use client';
import { Row } from '@tanstack/react-table';
import { TeacherColumns } from '@/components/school/teacher/table/columns';
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
import * as React from 'react';
import { useState } from 'react';
import { TeacherDialog } from '@/components/school/teacher/table/teacher-dialog';
import { AppAlertDialog } from '@/components/app-alert-dialog';

export function TeacherTableActions({ row }: { row: Row<TeacherColumns> }) {
  const teacherId = row.original.id;
  const { currentSchool } = useUserStore();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useDeleteTeachersMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['GetSchoolTeachers'],
      });
    },
  });

  const handleDelete = async () => {
    if (!currentSchool?.id) return;

    const promise = mutateAsync({
      teacherIds: [teacherId] as Array<string>,
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
      setOpenDeleteAlert(false);
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
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Ouvrez le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Editer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Copy')}>
            Copier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDeleteAlert(true)}
            variant="destructive"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openDeleteAlert && (
        <AppAlertDialog
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          isLoading={isPending}
          title="Êtes-vous absolument sûr ?"
          description="Cette action est irréversible. Elle supprimera définitivement ce professeur et toutes les données associées de l'école."
          onConfirm={handleDelete}
          cancelLabel="Annuler"
          confirmLabel="Supprimer"
        />
      )}
      {openEditDialog && (
        <TeacherDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          defaultValues={row.original}
        />
      )}
    </>
  );
}
