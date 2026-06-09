import { ResetPasswordType } from '@stackschool/shared';
export declare const onSubmit: (data: ResetPasswordType, onSuccess: (success: boolean) => void, token?: string) => Promise<void>;
export declare const HandleFallBack: ({ searchParams, }: {
    searchParams: Promise<{
        token?: string;
        method?: string;
    }>;
}) => import("react").JSX.Element | undefined;
//# sourceMappingURL=reset-password-view.d.ts.map