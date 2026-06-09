"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompleteProfileStore = void 0;
const shared_1 = require("@stackschool/shared");
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const redisService = new shared_1.RedisService();
exports.useCompleteProfileStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    school: null,
    profile: null,
    role: null,
    lastSavedAt: null,
    currentStep: 1,
    isSubmitting: false,
    error: null,
    setSchoolData: async (data) => {
        set({ school: data });
        await get().saveToRedis();
    },
    setProfileData: async (profileData) => {
        set({ profile: profileData, currentStep: 3 });
        await get().saveToRedis();
    },
    setCurrentStep: async (step) => {
        const state = get();
        if (step >= state.currentStep) {
            if (step <= 2 &&
                !(state.school?.type === 'join'
                    ? state.school.schoolSelected
                    : state.school?.type == 'create'
                        ? state.school.newSchool
                        : false)) {
                console.log('join');
                set({
                    error: "Veuillez d'abord joindre ou crée une école.",
                });
                return;
            }
            if (step >= 3 && !state.profile) {
                set({ error: "Veuillez d'abord compléter votre profil." });
                return;
            }
            if (step >= 4 && !state.role) {
                set({ error: "Veuillez d'abord définir votre rôle." });
                return;
            }
        }
        set({ currentStep: step });
        await get().saveToRedis();
    },
    setRoleData: async (role) => {
        set({ role });
        await get().saveToRedis();
    },
    reset: () => set({
        school: null,
        profile: null,
        role: null,
        isSubmitting: false,
        currentStep: 1,
        lastSavedAt: null,
    }),
    saveToRedis: async () => {
        try {
            const state = get();
            const res = await redisService.saveProgressToRedis({
                school: state.school,
                profile: state.profile,
                role: state.role,
                currentStep: state.currentStep,
            });
            if (res?.ok) {
                set({ lastSavedAt: new Date().toISOString() });
            }
        }
        catch (error) {
            const { message, data } = (0, shared_1.parseAxiosError)(error);
            set({ error: message });
            return {
                success: false,
                error: 'Échec sauvegarde Redis, utilisation localStorage',
            };
        }
    },
    loadFromRedis: async () => {
        try {
            const res = await redisService.loadFromRedis();
            if (res.ok) {
                const data = res.data;
                if (data && data.currentStep) {
                    set({
                        school: data.school,
                        role: data.role,
                        profile: data.profile,
                        currentStep: data.currentStep,
                        lastSavedAt: data.savedAt,
                    });
                }
                return true;
            }
        }
        catch (error) {
            return {
                success: false,
                error: 'Échec chargement Redis, utilisation localStorage',
            };
        }
    },
    setError: (err) => set({ error: err }),
    clearAllData: async () => {
        get().reset();
        try {
            await redisService.clearAllData();
        }
        catch (error) { }
    },
    submitCompleteProfile: async () => {
        const { school, role, profile, clearAllData } = get();
        if (!school || !role || !profile)
            return { success: false, error: 'Données manquantes' };
        set({ isSubmitting: true });
        try {
            const data = await authService.completeProfile({
                school,
                role,
                profile,
            });
            if (data.success) {
                await clearAllData();
                return { success: true };
            }
            else {
                return { success: true, error: data?.message };
            }
        }
        catch (error) {
            console.error('Erreur soumission profil:', error);
            return { success: false, error: 'Erreur réseau' };
        }
        finally {
            set({ isSubmitting: false });
        }
    },
}), {
    name: 'complete-profile-store',
    storage: (0, middleware_1.createJSONStorage)(() => sessionStorage),
}));
//# sourceMappingURL=complete-profile-store.js.map