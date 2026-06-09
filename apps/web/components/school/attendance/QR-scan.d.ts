interface ScannerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onScan: (badgeId: string) => void;
    isLoading?: boolean;
}
export declare function ScannerDialog({ open, onOpenChange, onScan, isLoading, }: ScannerDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=QR-scan.d.ts.map