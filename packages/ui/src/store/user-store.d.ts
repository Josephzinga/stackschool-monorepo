import { UserStore } from '../types';
export declare const useUserStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<UserStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<UserStore, {
            currentSchool: import("..").School | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: UserStore) => void) => () => void;
        onFinishHydration: (fn: (state: UserStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<UserStore, {
            currentSchool: import("..").School | null;
        }>>;
    };
}>;
//# sourceMappingURL=user-store.d.ts.map