"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
const ui_1 = require("@stackschool/ui");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, ui_1.clsx)(inputs));
}
//# sourceMappingURL=utils.js.map