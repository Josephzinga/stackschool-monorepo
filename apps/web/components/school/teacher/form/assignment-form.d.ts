import React from 'react';
export type TeacherAssignmentFormProps = {
    initialValues?: {
        teacherId?: string;
        classId?: string;
        assignments?: {
            id: string;
            subjectId: string;
        }[];
    };
    onSuccess?: () => void;
    onCancel?: () => void;
};
export declare const TeacherAssignmentForm: ({ initialValues, onSuccess, onCancel, }: TeacherAssignmentFormProps) => React.JSX.Element;
//# sourceMappingURL=assignment-form.d.ts.map