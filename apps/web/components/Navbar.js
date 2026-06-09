"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const react_1 = require("react");
const gsap_1 = __importDefault(require("gsap"));
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const data_1 = require("@/lib/data");
const sidebar_1 = require("./ui/sidebar");
function Navbar() {
    const [openGroups, setOpenGroups] = (0, react_1.useState)({});
    const contentRefs = (0, react_1.useRef)({});
    const timelines = (0, react_1.useRef)({});
    (0, react_1.useEffect)(() => {
        return () => {
            Object.values(timelines.current).forEach((tl) => tl?.kill());
        };
    }, []);
    const toggleGroup = (title) => {
        setOpenGroups((prev) => {
            const willOpen = !prev[title];
            const el = contentRefs.current[title];
            const next = { ...prev, [title]: willOpen };
            if (!el) {
                return next;
            }
            timelines.current[title]?.kill();
            if (willOpen) {
                gsap_1.default.set(el, { height: 0, opacity: 0, clearProps: "transform" });
                const fullHeight = el.scrollHeight;
                const tl = gsap_1.default.timeline();
                tl.to(el, {
                    height: fullHeight,
                    opacity: 1,
                    duration: 0.36,
                    ease: "power2.out",
                });
                tl.fromTo(Array.from(el.children), { y: 8, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.26 }, "<0.06");
                tl.call(() => gsap_1.default.set(el, { height: "auto" }));
                timelines.current[title] = tl;
            }
            else {
                const currentHeight = el.scrollHeight;
                const tl = gsap_1.default.timeline();
                tl.to(Array.from(el.children), {
                    y: 8,
                    opacity: 0,
                    stagger: 0.05,
                    duration: 0.12,
                });
                tl.to(el, {
                    height: 0,
                    opacity: 0,
                    duration: 0.28,
                    ease: "power2.inOut",
                }, "<0.02");
                timelines.current[title] = tl;
            }
            return next;
        });
    };
    return (<div className="">
      <sidebar_1.Sidebar className="">
        <sidebar_1.SidebarHeader>
          <div className="text-lg font-semibold text-center text-blue-600">
            Logo Fatt
          </div>
        </sidebar_1.SidebarHeader>

        <sidebar_1.SidebarContent>
          <sidebar_1.SidebarGroup>
            {data_1.menuItems.map((group) => (<div key={group.title} className="mb-2">
                
                <button onClick={() => toggleGroup(group.title)} className={`flex items-center justify-between w-full text-sm font-semibold px-3 py-2 transition rounded-md hover:bg-white cursor-pointer duration-200 ${openGroups[group.title]
                ? "text-blue-600 bg-blue-50 dark:bg-gray-800"
                : "text-gray-800 dark:text-gray-200 hover:text-blue-600"}`}>
                  <sidebar_1.SidebarGroupLabel>{group.title}</sidebar_1.SidebarGroupLabel>
                  
                  <lucide_react_1.ChevronDown className={`w-4 h-4 transition-transform ${openGroups[group.title] ? "rotate-180" : ""}`}/>
                </button>

                
                <div ref={(el) => (contentRefs.current[group.title] = el)} style={{
                overflow: "hidden",
                height: openGroups[group.title] ? "auto" : 0,
                opacity: openGroups[group.title] ? 1 : 0,
            }} className="ml-3 mt-1 space-y-1">
                  {group.items.map((item) => (<sidebar_1.SidebarGroupContent key={item.label}>
                      <sidebar_1.SidebarMenu>
                        <sidebar_1.SidebarMenuItem>
                          <sidebar_1.SidebarMenuButton asChild>
                            <link_1.default href={item.href} className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-md transition">
                              <item.icon className="w-4 h-4"/>
                              <span className="text-sm">{item.label}</span>
                            </link_1.default>
                          </sidebar_1.SidebarMenuButton>
                        </sidebar_1.SidebarMenuItem>
                      </sidebar_1.SidebarMenu>
                    </sidebar_1.SidebarGroupContent>))}
                </div>
              </div>))}
          </sidebar_1.SidebarGroup>
        </sidebar_1.SidebarContent>
      </sidebar_1.Sidebar>
    </div>);
}
//# sourceMappingURL=Navbar.js.map