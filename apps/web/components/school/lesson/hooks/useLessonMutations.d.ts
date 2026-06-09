import { LessonStatus } from '@stackschool/ui';
import { CreateLessonFormData } from '@stackschool/shared';
export declare const useLessonMutations: () => {
    handleUpdate: () => Promise<void>;
    handleDelete: (lessonId?: string) => Promise<void>;
    handleSubmitForm: (data: CreateLessonFormData, lessonId: string, isUpdate: boolean) => Promise<void>;
    handleUpdateStatus: (newStatus: LessonStatus, lessonId: string) => Promise<void>;
};
//# sourceMappingURL=useLessonMutations.d.ts.map