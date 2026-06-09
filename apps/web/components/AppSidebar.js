"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const sidebar_1 = require("./ui/sidebar");
const image_1 = __importDefault(require("next/image"));
const separator_1 = require("./ui/separator");
const AppSidebar = () => {
    console.log("joseph");
    return (<div className="">
      <sidebar_1.Sidebar>
        <sidebar_1.SidebarHeader>
          <link_1.default href="/" className="flex items-center gap-2">
            <image_1.default src="/logo-bg.png" alt="logo" width={60} height={60} className="rounded-full object-contain scale-3d scale-105"/>
            <span className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-transparent bg-clip-text">
              College Fatt
            </span>
          </link_1.default>
          <separator_1.Separator className="bg-border"/>
        </sidebar_1.SidebarHeader>
      </sidebar_1.Sidebar>
    </div>);
};
exports.default = AppSidebar;
//# sourceMappingURL=AppSidebar.js.map