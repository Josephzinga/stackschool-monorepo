import React from 'react';
import { StaffFormDataType } from '@stackschool/shared';
interface Props {
    role: 'ADMIN' | 'STAFF';
    onSubmit: (data: StaffFormDataType) => void;
    onBack: () => void;
    isLoading?: boolean;
}
export default function StaffAdminForm({ role, onSubmit, onBack, isLoading, }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=staff-admin-form.d.ts.map