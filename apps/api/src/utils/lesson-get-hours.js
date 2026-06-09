"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyHours = void 0;
const getWeeklyHours = (lessons) => {
    let totalMinutes = 0;
    lessons.forEach((l) => {
        const diffMs = l.endTime.getHours() * 60 +
            l.endTime.getMinutes() -
            (l.startTime.getHours() * 60 + l.endTime.getMinutes());
        totalMinutes += diffMs;
    });
    return parseFloat((totalMinutes / 60).toFixed(1));
};
exports.getWeeklyHours = getWeeklyHours;
//# sourceMappingURL=lesson-get-hours.js.map