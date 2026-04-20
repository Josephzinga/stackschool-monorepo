'use client';

import { Row, TableMeta } from '@tanstack/react-table';
import { ParentColumn } from './column';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { toast } from 'sonner';

export function ParentActions({
  row,
  meta,
}: {
  row: Row<ParentColumn>;
  meta: TableMeta<ParentColumn>;
}) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = async () => {
    // Sera implémenté avec la mutation correspondante
    toast.info('La suppression des parents sera bientôt disponible');
    setShowDeleteAlert(false);
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
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => console.log('Edit', row.original.id)}
          >
            Editer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log('Copy', row.original.id)}
          >
            Copier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => setShowDeleteAlert(true)}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppAlertDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        title="Supprimer ce parent ?"
        description="Cette action est irréversible. Les liens avec les élèves seront également supprimés."
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        variant="destructive"
      />
    </>
  );
}
