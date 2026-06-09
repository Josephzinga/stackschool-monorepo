"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridForm = void 0;
const utils_1 = require("@/lib/utils");
const GridForm = ({ children, className, }) => (<div className={(0, utils_1.cn)('grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3', className)}>
    {children}
  </div>);
exports.GridForm = GridForm;
//# sourceMappingURL=grid-form.js.map