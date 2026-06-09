"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedTransitions = void 0;
exports.canTransition = canTransition;
exports.allowedTransitions = {
    PLANNED: ['ONGOING', 'CANCELLED', 'POSTPONED'],
    ONGOING: ['COMPLETED', 'CANCELLED'],
    POSTPONED: ['PLANNED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
};
function canTransition(current, target) {
    if (!current)
        return;
    return exports.allowedTransitions[current]?.includes(target);
}
//# sourceMappingURL=lesson-check-status.js.map