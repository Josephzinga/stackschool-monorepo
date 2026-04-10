'use client';
import React from 'react';
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
import { dayConstant } from '@stackschool/shared';
import { useLessonStore } from '@/store/lesson-store';
import { useLessonMutations } from '@/components/school/lesson/hooks/useLessonMutations';

export default function LessonAlertDialog({
  onCancelUpdate,
}: {
  onCancelUpdate: () => void;
}) {
  const { alertOpen, setAlertOpen, targetEventDrop } = useLessonStore();
  const { handleUpdate } = useLessonMutations();

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent className="max-w-90! max-h-100! shadow-2xl!">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir modifier cette leçon ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm p-4 bg-muted rounded-lg">
          <div className="space-y-2  text-xs  md:text-sm">
            <p className="font-medium text-muted-foreground">Avant :</p>
            <div className="space-y-1">
              <p>
                Début:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.originalStart}
                </span>
              </p>
              <p>
                Fin:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.originalEnd}
                </span>
              </p>
              <p>
                Jour:{' '}
                <span className="text-foreground">
                  {
                    dayConstant.find(
                      (d) => d.value === targetEventDrop?.originalDay,
                    )?.label
                  }
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs  md:text-sm">
            <p className="font-medium text-primary">Après :</p>
            <div className="space-y-1">
              <p>
                Début:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.start}
                </span>
              </p>
              <p>
                Fin:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.end}
                </span>
              </p>
              <p>
                Jour:{' '}
                <span className="text-foreground">
                  {
                    dayConstant.find((d) => d.value === targetEventDrop?.day)
                      ?.label
                  }
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ La modification affectera l'emploi du temps pour toutes les
            ressources concernées.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className=" h-8!" onClick={onCancelUpdate}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction className="h-8" onClick={handleUpdate}>
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
