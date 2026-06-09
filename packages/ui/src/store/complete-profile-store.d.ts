import { CompleteProfileStep } from '../types';
export declare const useCompleteProfileStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CompleteProfileStep>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CompleteProfileStep, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CompleteProfileStep) => void) => () => void;
        onFinishHydration: (fn: (state: CompleteProfileStep) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CompleteProfileStep, unknown>>;
    };
}>;
//# sourceMappingURL=complete-profile-store.d.ts.map