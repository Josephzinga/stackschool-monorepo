import { RoleDataType, SchoolDataType, ProfileData } from '@stackschool/shared';
interface CompleteProfileStep {
    school: SchoolDataType | null;
    profile: ProfileData | null;
    role: RoleDataType | null;
    lastSavedAt: string | null;
    setSchoolData: (school: SchoolDataType) => void;
    setProfileData: (profileData: ProfileData) => void;
    setRole: (role: RoleDataType) => void;
    reset: () => void;
    saveToRedis: () => Promise<void>;
    loadFromRedis: () => Promise<boolean | undefined>;
    clearAllData: () => Promise<void>;
    setCurrentStep: (step: number) => void;
    submitCompleteProfile: () => Promise<{
        success: boolean;
        error?: string | any;
    }>;
    isSubmitting: boolean;
    currentStep: number;
}
export declare const UseCompleteProfileStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CompleteProfileStep>, "setState" | "persist"> & {
    setState(partial: CompleteProfileStep | Partial<CompleteProfileStep> | ((state: CompleteProfileStep) => CompleteProfileStep | Partial<CompleteProfileStep>), replace?: false | undefined): unknown;
    setState(state: CompleteProfileStep | ((state: CompleteProfileStep) => CompleteProfileStep), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CompleteProfileStep, unknown, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CompleteProfileStep) => void) => () => void;
        onFinishHydration: (fn: (state: CompleteProfileStep) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CompleteProfileStep, unknown, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=complete-profiile-store-v1.d.ts.map