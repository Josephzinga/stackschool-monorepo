"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteHeader = SiteHeader;
const separator_1 = require("@/components/ui/separator");
const sidebar_1 = require("@/components/ui/sidebar");
const search_input_1 = require("@/components/search-input");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const theme_toogle_1 = require("@/components/animate-ui/components/buttons/theme-toogle");
function SiteHeader() {
    return (<header className="flex h-16 sticky top-0 backdrop-blur-xl border-b right-0 w-full bg-sidebar/50 shadow-sm shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center h-full gap-1 px-4 lg:gap-2 lg:px-6">
        <sidebar_1.SidebarTrigger className="-ml-1"/>
        <separator_1.Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
        <div className="flex ml-10 items-center flex-1 w-[75%]">
          <div className="hidden md:block">
            <search_input_1.SearchInput className="h-12 font-poppins " placeholder="Rechercher..."/>
          </div>
        </div>
        <div className="flex items-center justify-end w-[25%] gap-4">
          <theme_toogle_1.ThemeTogglerButton modes={['dark', 'light']} direction="rtl"/>
          <button_1.Button variant="ghost" size="icon" className="w-10 h-10 border-primary border">
            <lucide_react_1.Bell />
          </button_1.Button>
        </div>
      </div>
    </header>);
}
//# sourceMappingURL=site-header.js.map