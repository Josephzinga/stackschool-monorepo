import { GetStudentDetailsQuery } from '@stackschool/ui';
interface CreateStudentFormProps {
    mode?: 'QUICK_ADD' | 'FULL_EDIT';
    onSuccess?: () => void;
    initialValues?: GetStudentDetailsQuery['student'];
}
export declare function CreateStudentForm({ onSuccess, initialValues, mode, }: CreateStudentFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=create-student-form.d.ts.map