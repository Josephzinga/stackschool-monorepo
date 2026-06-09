"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoItem = InfoItem;
const utils_1 = require("@/lib/utils");
function InfoItem({ children, icon: Icon, className, iconClassName, notFoundText = 'Non assignée', label, value, }) {
    if (!children && !notFoundText)
        return null;
    return (<div className="flex items-center gap-1 xl:gap-3">
      <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full">
        <Icon className={(0, utils_1.cn)('h-4 w-4 text-slate-600', iconClassName)}/>
      </div>
      <div className={(0, utils_1.cn)('text-sm text-wrap font-medium text-slate-700 dark:text-slate-200', className)}>
        <p className="text-xs text-muted-foreground opacity-80 uppercase tracking-wider">
          {label}
        </p>
        {children ? (children) : (<>
            <p className="font-medium text-sm">
              {value || (<span className="font-mono opacity-70 text-xs">
                  {notFoundText}
                </span>)}
            </p>
          </>)}
      </div>
    </div>);
}
//# sourceMappingURL=info-item.js.map