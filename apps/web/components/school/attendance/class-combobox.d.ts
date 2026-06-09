import { ClassOption } from '@/types/attendance';
interface ClassComboboxProps {
    classes: ClassOption[];
    selectedClass: string | null;
    onSelect: (classId: string | null) => void;
}
export declare function ClassCombobox({ classes, selectedClass, onSelect, }: ClassComboboxProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=class-combobox.d.ts.map