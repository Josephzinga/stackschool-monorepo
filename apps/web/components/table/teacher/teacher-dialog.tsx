'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateTeacherForm } from '@/components/table/teacher/create-teacher-form'; // Réutilisation !

export function TeacherDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    // Ici, on pourrait rafraîchir la table via le contexte ou React Query invalide
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Enseignant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Professeur</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un enseignant à l'école.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* On passe une prop onSuccess si TeacherForm la supporte, sinon on adaptera */}
          <CreateTeacherForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
