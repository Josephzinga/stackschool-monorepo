"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextService = void 0;
const api_1 = require("../../lib/api");
exports.contextService = {
    parentContext: async () => {
        const res = await api_1.api.get('/complete-profile/parent/context');
        return res.data;
    },
    studentContext: async () => {
        const res = await api_1.api.get('/complete-profile/student/context');
        return res.data;
    },
};
//# sourceMappingURL=context.service.js.map