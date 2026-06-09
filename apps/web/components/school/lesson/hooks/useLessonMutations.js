"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLessonMutations = void 0;
const sonner_1 = require("sonner");
const lesson_store_1 = require("@/store/lesson-store");
const react_query_1 = require("@tanstack/react-query");
const ui_1 = require("@stackschool/ui");
const useLessonMutations = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const { targetEventDrop, setTargetEventDrop, setLessonDialogOpen, resourceMode, resource, } = (0, lesson_store_1.useLessonStore)();
    const invalidateQueries = async () => {
        await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
        await queryClient.invalidateQueries({ queryKey: ['GetClassSubjectTable'] });
    };
    const { mutateAsync: updateMutate } = (0, ui_1.useUpdateLessonMutation)({
        onSuccess: async () => {
            await invalidateQueries();
            setLessonDialogOpen(false);
        },
    });
    const { mutateAsync: updateStatusMutate } = (0, ui_1.useUpdateLessonStatusMutation)({
        onSuccess: async () => {
            await invalidateQueries();
        },
    });
    const { mutateAsync: createMutate } = (0, ui_1.useCreateLessonMutation)({
        onSuccess: async () => {
            await invalidateQueries();
            setLessonDialogOpen(false);
        },
    });
    const mutation = (0, ui_1.useUpdateLessonMutation)();
    const { mutateAsync: deleteMutate } = (0, ui_1.useDeleteLessonMutation)({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['GetSchoolLessons'] });
        },
    });
    const handleUpdate = async () => {
        if (!targetEventDrop)
            return;
        const promise = mutation.mutateAsync({
            input: {
                id: targetEventDrop.id,
                startTime: targetEventDrop.start,
                endTime: targetEventDrop.end,
                day: targetEventDrop.day,
                subjectId: targetEventDrop?.subjectId,
                teacherId: resourceMode === 'TEACHER' ? targetEventDrop?.resourceId : undefined,
                groupId: resourceMode === 'CLASS' ? targetEventDrop.resourceId : undefined,
                mode: resourceMode,
            },
        });
        sonner_1.toast.promise(promise, {
            loading: 'Mise à jour en cours...',
            success: () => {
                queryClient.invalidateQueries({ queryKey: ['getSchoolLessons'] });
                setTargetEventDrop(null);
                return 'Leçon mise à jour avec succès';
            },
            error: (err) => {
                console.error('Update error:', err);
                if (targetEventDrop)
                    targetEventDrop?.revertFunc?.();
                return err?.message || 'Erreur lors de la mise à jour de la leçon';
            },
            toasterId: 'dashboard',
        });
    };
    const handleDelete = async (lessonId) => {
        if (!lessonId)
            return;
        const promise = deleteMutate({
            id: lessonId,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: 'Leçon supprimer avec succès.',
            error: (err) => {
                return err?.message || 'Erreur lors de la suppression de leçon.';
            },
            toasterId: 'dashboard',
        });
        setLessonDialogOpen(false);
    };
    const handleUpdateStatus = async (newStatus, lessonId) => {
        if (!lessonId)
            return;
        const promise = updateStatusMutate({
            status: newStatus,
            id: lessonId,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Mise à jour en cours..',
            success: 'Mise à jour réussi avec succès',
            error: 'Error lors de la mise à jour',
            toasterId: 'dashboard',
        });
        setLessonDialogOpen(false);
    };
    const handleSubmitForm = async (data, lessonId, isUpdate) => {
        const promise = isUpdate
            ? updateMutate({
                input: {
                    ...data,
                    id: lessonId,
                    day: data.day,
                    mode: resourceMode,
                },
            })
            : createMutate({
                input: {
                    ...data,
                    day: data?.day,
                    mode: resourceMode,
                },
            });
        sonner_1.toast.promise(promise, {
            loading: isUpdate ? 'Modification en cours...' : 'Création en cours...',
            success: isUpdate
                ? 'Modification réussie avec succès'
                : 'Création réussie avec succès',
            error: (err) => {
                return (err?.message ||
                    (isUpdate
                        ? 'Erreur lors de la mise à jour du leçon'
                        : 'Erreur lors de la création du leçon'));
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
exports.useLessonMutations = useLessonMutations;
//# sourceMappingURL=useLessonMutations.js.map