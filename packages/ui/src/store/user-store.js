"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useUserStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    user: null,
    loading: true,
    isAuthenticated: false,
    currentSchool: null,
    setUser: (user) => {
        set({
            user,
            isAuthenticated: !!user,
            loading: false,
        });
    },
    setCurrentSchool: (school) => {
        set({ currentSchool: school });
    },
}), {
    name: 'user-storage',
    partialize: (state) => ({ currentSchool: state.currentSchool }),
}));
//# sourceMappingURL=user-store.js.map