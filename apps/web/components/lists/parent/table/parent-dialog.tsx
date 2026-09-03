'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';

interface ParentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: any;
}

export function ParentDialog({
  open,
  setOpen,
  initialValues,
}: ParentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? 'Modifier le parent' : 'Ajouter un parent'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du parent. Vous pourrez lier des élèves
            après la création.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Le formulaire ParentForm sera intégré ici */}
          <p className="text-center text-muted-foreground py-8">
            Formulaire parent en cours de développement
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
