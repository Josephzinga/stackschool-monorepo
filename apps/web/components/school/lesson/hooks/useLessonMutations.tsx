import { toast } from 'sonner';
import { useLessonStore } from '@/store/lesson-store';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateLessonMutation } from '@stackschool/ui';
import { useLessonEvents } from '@/components/school/lesson/hooks/useLessonEvents';

export const useLessonMutations = () => {
  const queryClient = useQueryClient();
  const { targetEventDrop, setTargetEventDrop, setAlertOpen } =
    useLessonStore();
  const { calendarRef } = useLessonEvents();

  const mutation = useUpdateLessonMutation();

  const handleUpdate = async () => {
    if (!targetEventDrop) return;

    const promise = mutation.mutateAsync({
      input: {
        id: targetEventDrop.id,
        startTime: targetEventDrop.start,
        endTime: targetEventDrop.end,
        day: targetEventDrop.day,
      },
    });

    toast.promise(promise, {
      loading: 'Mise à jour en cours...',
      success: () => {
        // Invalider les queries pour rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ['getSchoolLessons'] });
        setTargetEventDrop(null);
        return 'Leçon mise à jour avec succès';
      },
      error: (err) => {
        console.error('Update error:', err);
        return err?.message || 'Erreur lors de la mise à jour de la leçon';
      },
    });
    try {
      await promise;
    } catch (error) {
      // Si l'update échoue, on pourrait vouloir revert le drop/resize
      // Mais FullCalendar a déjà appliqué le changement visuellement
      // Il faudrait rafraîchir le calendrier
      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.refetchEvents();
    } finally {
      setAlertOpen(false);
    }
  };

  return {
    handleUpdate,
  };
};
