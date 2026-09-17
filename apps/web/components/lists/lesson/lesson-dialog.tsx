'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { canTransition, LessonStatusEnum } from '@stackschool/contracts';
import { useLessonStore } from '@/store/lesson-store';
import { cn } from '@/lib/utils';
import { useLessonForm } from '@/components/lists/lesson/hooks/useLessonForm';
import { LessonFormFields } from '@/components/lists/lesson/lesson-form-fieds';

interface LessonDialogProps {
  onSuccess: () => Promise<void>;
}

export default function LessonDialog({ onSuccess }: LessonDialogProps) {
  const { lessonDialogOpen, setLessonDialogOpen, resourceMode } =
    useLessonStore();

  const {
    isClassMode,
    isUpdate,
    resourceTitle,
    lessonId,
    lessonStatus,
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isDirty,
    onSubmit,
    uniqueSubjects,
    uniqueSecondary,
    selectedSubjectId,
    handleSubjectChange,
    handleSecondaryChange,
    handleDelete,
    handleUpdateStatus,
  } = useLessonForm(onSuccess);

  return (
    <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
      <DialogContent className="max-w-150 md:min-w-120 shadow-2xl! px-3 md:px-4">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Modifier la leçon' : 'Créer une leçon'}
          </DialogTitle>
          <DialogDescription className="text-sm font-poppins font-semibold opacity-80">
            {resourceMode === 'CLASS' ? (
              <>
                Classe :{' '}
                <span className="text-primary font-medium">
                  {resourceTitle}
                </span>
              </>
            ) : (
              <>
                Enseignant :{' '}
                <span className="text-primary font-medium">
                  {resourceTitle}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log('Error: ', err);
          })}
          className="flex flex-col justify-center gap-4"
        >
          <LessonFormFields
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            isClassMode={isClassMode}
            uniqueSubjects={uniqueSubjects! ?? []}
            uniqueSecondary={uniqueSecondary ?? []}
            selectedSubjectId={selectedSubjectId}
            handleSubjectChange={handleSubjectChange}
            handleSecondaryChange={handleSecondaryChange}
          />

          <DialogFooter className="flex flex-row md:justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {isUpdate && (
                <>
                  {canTransition(lessonStatus, 'ONGOING') && (
                    <Button
                      type="button"
                      className="text-xs px-2 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() =>
                        handleUpdateStatus(LessonStatusEnum.Ongoing, lessonId)
                      }
                    >
                      Démarrer
                    </Button>
                  )}
                  {canTransition(lessonStatus, 'COMPLETED') && (
                    <Button
                      type="button"
                      className="text-xs px-2"
                      onClick={() =>
                        handleUpdateStatus(LessonStatusEnum.Completed, lessonId)
                      }
                    >
                      Marquer terminée
                    </Button>
                  )}
                  {canTransition(lessonStatus, 'CANCELLED') && (
                    <Button
                      className="text-xs px-2 bg-gray-600 hover:bg-gray-700"
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(LessonStatusEnum.Cancelled, lessonId)
                      }
                    >
                      Annuler
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="flex">
              {isUpdate && (
                <Button
                  type="button"
                  variant="destructive"
                  className="text-xs px-2"
                  onClick={() => handleDelete(lessonId)}
                >
                  Supprimer
                </Button>
              )}
              <Button
                type="submit"
                className={cn(
                  !isDirty && 'cursor-not-allowed',
                  'font-semibold',
                )}
              >
                {isUpdate ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
