"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentStatusBadge = StudentStatusBadge;
const ui_1 = require("@stackschool/ui");
const badge_1 = require("@/components/ui/badge");
const utils_1 = require("@/lib/utils");
const studentStatusStyles = {
    ACTIVE: 'bg-green-700/20 text-green-500',
    SUSPENDED: 'bg-orange-100 text-orange-700',
    EXPELLED: 'bg-red-100 text-red-700',
    TRANSFERRED: 'bg-blue-100 text-blue-700',
    DROPPED_OUT: 'bg-purple-100 text-purple-700',
    GRADUATED: 'bg-emerald-100 text-emerald-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
    DECEASED: 'bg-zinc-200 text-zinc-700',
};
function StudentStatusBadge({ status, }) {
    const config = ui_1.studentStatusConfig[status];
    console.log(studentStatusStyles[status]);
    return (<badge_1.Badge className={(0, utils_1.cn)('px-2 py-0.5 text-xs font-medium', studentStatusStyles[status])}>
      {config.label}
    </badge_1.Badge>);
}
//# sourceMappingURL=studen-status-badge.js.map