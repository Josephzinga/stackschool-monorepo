'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavSecondary = NavSecondary;
const React = __importStar(require("react"));
const sidebar_1 = require("@/components/ui/sidebar");
const link_1 = __importDefault(require("next/link"));
function NavSecondary({ items, ...props }) {
    return (<sidebar_1.SidebarGroup {...props}>
      <sidebar_1.SidebarGroupContent>
        <sidebar_1.SidebarMenu>
          {items.map((item, i) => (<sidebar_1.SidebarMenuItem key={i}>
              <sidebar_1.SidebarMenuButton asChild>
                <link_1.default href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </link_1.default>
              </sidebar_1.SidebarMenuButton>
            </sidebar_1.SidebarMenuItem>))}
        </sidebar_1.SidebarMenu>
      </sidebar_1.SidebarGroupContent>
    </sidebar_1.SidebarGroup>);
}
//# sourceMappingURL=nav-secondary.js.map