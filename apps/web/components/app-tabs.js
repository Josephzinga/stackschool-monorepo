"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppTabs = AppTabs;
exports.AppTabsTrigger = AppTabsTrigger;
exports.AppTabsList = AppTabsList;
exports.AppTabsContent = AppTabsContent;
const tabs_1 = require("@/components/animate-ui/components/radix/tabs");
const utils_1 = require("@/lib/utils");
function AppTabs({ children, defaultValue, className, }) {
    return (<tabs_1.Tabs defaultValue={defaultValue} className={(0, utils_1.cn)('w-full', className)}>
      {children}
    </tabs_1.Tabs>);
}
function AppTabsTrigger({ children, value, }) {
    return (<tabs_1.TabsTrigger value={value} className="rounded-[5px] font-poppins font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent/40 px-4 py-2">
      {children}
    </tabs_1.TabsTrigger>);
}
function AppTabsList({ children, className, }) {
    return (<tabs_1.TabsList className={(0, utils_1.cn)('w-full bg-accent justify-start border-b rounded-sm p-0 h-auto no-scrollbar overflow-x-auto no-scrollbar md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:block', className)}>
      {children}
    </tabs_1.TabsList>);
}
function AppTabsContent({ children, value, className, }) {
    return (<tabs_1.TabsContent className={(0, utils_1.cn)(className)} value={value}>
      {children}
    </tabs_1.TabsContent>);
}
//# sourceMappingURL=app-tabs.js.map