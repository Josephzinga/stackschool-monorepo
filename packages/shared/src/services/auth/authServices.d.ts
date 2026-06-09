import type { LoginFormType, ProfileType, RegisterFormType } from '../../../src';
export declare const authServices: {
    setBaseUrl: (url: string) => void;
    getApiBaseUrl: () => string | undefined;
    login: (data: LoginFormType) => Promise<any>;
    register: (data: RegisterFormType) => Promise<any>;
    _logout: () => Promise<any>;
    getMe: () => Promise<any>;
    forgotPassword: (identifier: string) => Promise<any>;
    resendCode: (tempToken?: string | null) => Promise<any>;
    verifyCode: (code: string, tempToken?: string | null) => Promise<any>;
    resetPassword: (token: string | null, password: string, confirm: string) => Promise<any>;
    updateProfile: (data: ProfileType) => Promise<any>;
    refresh: () => Promise<any>;
    socialRedirect: (provider: string) => Promise<any>;
    checkField: (field: string, value: string) => Promise<any>;
    completeProfile: (data: any) => Promise<any>;
};
//# sourceMappingURL=authServices.d.ts.map