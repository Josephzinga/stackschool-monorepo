"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCompleteProfileStore = void 0;
const api_1 = __importDefault(require("@/services/api"));
const complete_profile_1 = require("@/services/complete-profile");
const sonner_1 = require("sonner");
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.UseCompleteProfileStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    school: null,
    profile: null,
    role: null,
    lastSavedAt: null,
    currentStep: 1,
    isSubmitting: false,
    setSchoolData: async (data) => {
        set({ school: data });
        await get().saveToRedis();
    },
    setProfileData: async (profileData) => {
        set({ profile: profileData });
        await get().saveToRedis();
    },
    setCurrentStep: async (step) => {
        set({ currentStep: step });
    },
    setRole: async (role) => {
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
            const res = await (0, complete_profile_1.saveProgressToRedis)({
                school: state.school,
                profile: state.profile,
                role: state.role,
                currentStep: state.currentStep,
            });
            if (res?.ok) {
                set({ lastSavedAt: new Date().toISOString() });
                sonner_1.toast.success(res.message);
            }
        }
        catch (error) {
            sonner_1.toast.warning('Échec sauvegarde Redis, continuation avec localStorage');
        }
    },
    loadFromRedis: async () => {
        try {
            const res = await api_1.default.get('/complete-profile/load-progress');
            if (res.data?.ok) {
                const { data } = res;
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
            console.warn('Échec chargement Redis, utilisation localStorage');
        }
        return false;
    },
    clearAllData: async () => {
        get().reset();
        try {
            await api_1.default.post('/complete-profile/clear-progress');
        }
        catch (error) { }
    },
    submitCompleteProfile: async () => {
        const { school, role, profile, clearAllData } = get();
        if (!school || !role || !profile)
            return { success: false, error: 'Données manquantes' };
        set({ isSubmitting: true });
        try {
            const res = await api_1.default.post('/complete-profile', {
                school,
                role,
                profile,
            });
            const { data } = res;
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
    name: 'complete-profile-storage',
    storage: (0, middleware_1.createJSONStorage)(() => localStorage),
    version: 1,
}));
//# sourceMappingURL=complete-profiile-store-v1.js.map