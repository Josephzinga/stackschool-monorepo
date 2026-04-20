import { toast } from 'sonner';
import { useLessonStore } from '@/store/lesson-store';
import { useQueryClient } from '@tanstack/react-query';
import {
  Day,
  LessonStatus,
  ResourceMode,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
  useUpdateLessonStatusMutation,
} from '@stackschool/ui';
import { CreateLessonFormData } from '@stackschool/shared';

export const useLessonMutations = () => {
  const queryClient = useQueryClient();
  const {
    targetEventDrop,
    setTargetEventDrop,
    setLessonDialogOpen,
    resourceMode,
    resource,
  } = useLessonStore();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
    await queryClient.invalidateQueries({ queryKey: ['GetClassSubjectTable'] });
  };

  const { mutateAsync: updateMutate } = useUpdateLessonMutation({
    onSuccess: async () => {
    await invalidateQueries();
      setLessonDialogOpen(false);
    },
  });

  const { mutateAsync: updateStatusMutate } = useUpdateLessonStatusMutation({
    onSuccess: async () => {
    await invalidateQueries();
    },
  });

  const { mutateAsync: createMutate } = useCreateLessonMutation({
    onSuccess: async () => {
    await invalidateQueries();
      setLessonDialogOpen(false);
    },
  });

  const mutation = useUpdateLessonMutation();
  const { mutateAsync: deleteMutate } = useDeleteLessonMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
    },
  });
  const handleUpdate = async () => {
    if (!targetEventDrop) return;

    const promise = mutation.mutateAsync({
      input: {
        id: targetEventDrop.id,
        startTime: targetEventDrop.start,
        endTime: targetEventDrop.end,
        day: targetEventDrop.day,
        subjectId: targetEventDrop?.subjectId,
        teacherId:
          resourceMode === 'TEACHER' ? targetEventDrop?.resourceId : undefined,
        groupId:
          resourceMode === 'CLASS' ? targetEventDrop.resourceId : undefined,
        mode: resourceMode as ResourceMode,
      },
    });

    toast.promise(promise, {
      loading: 'Mise à jour en cours...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['getSchoolLessons'] });
        setTargetEventDrop(null);
        return 'Leçon mise à jour avec succès';
      },
      error: (err) => {
        console.error('Update error:', err);
        if (targetEventDrop) targetEventDrop?.revertFunc?.();
        return err?.message || 'Erreur lors de la mise à jour de la leçon';
      },
      toasterId: 'dashboard',
    });
  };
  const handleDelete = async (lessonId?: string) => {
    if (!lessonId) return;

    const promise = deleteMutate({
      id: lessonId,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: 'Leçon supprimer avec succès.',
      error: (err) => {
        return err?.message || 'Erreur lors de la suppression de leçon.';
      },
      toasterId: 'dashboard',
    });
    setLessonDialogOpen(false);
  };

  const handleUpdateStatus = async (
    newStatus: LessonStatus,
    lessonId: string,
  ) => {
    if (!lessonId) return;

    const promise = updateStatusMutate({
      status: newStatus,
      id: lessonId,
    });

    toast.promise(promise, {
      loading: 'Mise à jour en cours..',
      success: 'Mise à jour réussi avec succès',
      error: 'Error lors de la mise à jour',
      toasterId: 'dashboard',
    });
    setLessonDialogOpen(false);
  };

  const handleSubmitForm = async (
    data: CreateLessonFormData,
    lessonId: string,
    isUpdate: boolean,
  ) => {
    const promise = isUpdate
      ? updateMutate({
          input: {
            ...data,
            id: lessonId,
            day: data.day as Day,
            mode: resourceMode as ResourceMode,
          },
        })
      : createMutate({
          input: {
            ...data,
            day: data?.day as Day,
            mode: resourceMode as ResourceMode,
          },
        });
    toast.promise(promise, {
      loading: isUpdate ? 'Modification en cours...' : 'Création en cours...',
      success: isUpdate
        ? 'Modification réussie avec succès'
        : 'Création réussie avec succès',
      error: (err) => {
        return (
          err?.message ||
          (isUpdate
            ? 'Erreur lors de la mise à jour du leçon'
            : 'Erreur lors de la création du leçon')
        );
      },
      toasterId: 'dashboard',
    });
  };

  return {
    handleUpdate,
    handleDelete,
    handleSubmitForm,
    handleUpdateStatus,
  };
};
