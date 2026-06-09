import { CreateTeacherValues } from '@stackschool/shared';
import 'react-phone-number-input/style.css';
interface EditDefaultValues extends CreateTeacherValues {
    id: string;
}
interface CreateTeacherFormProps {
    onSuccess?: () => void;
    editDefaultValues?: EditDefaultValues;
}
export declare function CreateTeacherForm({ onSuccess, editDefaultValues, }: CreateTeacherFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=create-teacher-form.d.ts.map