import * as React from 'react';
interface AppAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    variant?: 'default' | 'destructive';
    descriptionClassName?: string;
}
export declare const AppAlertDialog: ({ open, onOpenChange, title, description, onConfirm, onCancel, confirmLabel, cancelLabel, isLoading, variant, descriptionClassName, }: AppAlertDialogProps) => React.JSX.Element;
export {};
//# sourceMappingURL=app-alert-dialog.d.ts.map