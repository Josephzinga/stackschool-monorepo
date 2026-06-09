import { AttendanceStatus } from '@stackschool/ui';
interface StatusBadgeGroupProps {
    value: AttendanceStatus;
    onChange: (status: AttendanceStatus) => void;
    size?: 'sm' | 'md';
}
export declare function StatusBadgeGroup({ value, onChange, size, }: StatusBadgeGroupProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=status-radio-group.d.ts.map