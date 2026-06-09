"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEventConflicts = exports.doRangesOverlap = exports.getEventDateTimeRange = exports.toMinutes = void 0;
const date_fns_1 = require("date-fns");
const constants_1 = require("../constants");
const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
exports.toMinutes = toMinutes;
const getEventDateTimeRange = (event, referenceDate = constants_1.REFERENCE_DATE) => {
    const eventDayOfWeek = event.daysOfWeek?.[0];
    const currentDayOfWeek = (0, date_fns_1.getDay)(referenceDate);
    let daysToAdd = eventDayOfWeek - currentDayOfWeek;
    if (daysToAdd < 0)
        daysToAdd += 6;
    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() + daysToAdd);
    const [startHours, startMinutes] = event.startTime?.split(':') || [
        '00',
        '00',
    ];
    startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    const endDate = new Date(startDate);
    const [endHours, endMinutes] = event.endTime?.split(':') || ['00', '00'];
    endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    return { startDate, endDate };
};
exports.getEventDateTimeRange = getEventDateTimeRange;
const doRangesOverlap = (s1, e1, s2, e2) => {
    return (0, exports.toMinutes)(s1) < (0, exports.toMinutes)(e2) && (0, exports.toMinutes)(e1) > (0, exports.toMinutes)(s2);
};
exports.doRangesOverlap = doRangesOverlap;
const checkEventConflicts = (newEvent, existingEvents, excludeEventId) => {
    const newDay = newEvent.daysOfWeek?.[0];
    for (const existingEvent of existingEvents) {
        if (excludeEventId && existingEvent.id === excludeEventId)
            continue;
        const existingDay = existingEvent.daysOfWeek?.[0];
        if (newDay !== existingDay)
            continue;
        if ((0, exports.doRangesOverlap)(newEvent.startTime, newEvent.endTime, existingEvent.startTime, existingEvent.endTime)) {
            return true;
        }
    }
    return false;
};
exports.checkEventConflicts = checkEventConflicts;
//# sourceMappingURL=check-lesson-conflict.js.map