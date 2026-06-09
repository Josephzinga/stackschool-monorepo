import React from 'react';
export interface InitialValues {
    id: string;
    classId?: string;
    coefficient?: number | null;
    weeklyHours?: number | null;
    subjectId?: string;
    teacherId?: string;
}
interface CreateClassSubjectFormProps {
    classId?: string;
    initialValues?: InitialValues;
    onSuccess?: () => void;
}
export declare function CreateClassSubjectForm({ classId, initialValues, onSuccess, }: CreateClassSubjectFormProps): React.JSX.Element;
export {};
//# sourceMappingURL=create-classSubject-form.d.ts.map