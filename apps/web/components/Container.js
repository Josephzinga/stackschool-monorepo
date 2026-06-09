"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const utils_1 = require("@/lib/utils");
const Container = ({ children, className, }) => {
    return (<div className={(0, utils_1.cn)('flex w-full min-h-screen items-center justify-center bg-slate-100 dark:bg-gray-900 ', className)}>
      {children}
    </div>);
};
exports.Container = Container;
//# sourceMappingURL=Container.js.map