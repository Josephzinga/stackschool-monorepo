import {create} from 'zustand';

interface LoadingState {
    isLoading: boolean;
    show: () => void;
    hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    show: () => set({ isLoading: true }),
    hide: () => set({ isLoading: false }),
}));
