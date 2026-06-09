"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceResolver = void 0;
exports.attendanceResolver = {
    AttendanceRecord: {
        recordedBy: async (parent, _args, { loaders }) => {
            if (!parent.recordedBy)
                return null;
            return await loaders.userLoader.load(parent.recordedBy);
        },
    },
};
//# sourceMappingURL=attendance.resolver.js.map