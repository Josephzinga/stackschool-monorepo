"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toaster = void 0;
const lucide_react_1 = require("lucide-react");
const next_themes_1 = require("next-themes");
const sonner_1 = require("sonner");
const Toaster = ({ ...props }) => {
    const { theme = "system" } = (0, next_themes_1.useTheme)();
    return (<sonner_1.Toaster theme={theme} className="toaster group " icons={{
            success: <lucide_react_1.CircleCheckIcon className="size-4"/>,
            info: <lucide_react_1.InfoIcon className="size-4"/>,
            warning: <lucide_react_1.TriangleAlertIcon className="size-4"/>,
            error: <lucide_react_1.OctagonXIcon className="size-4 text-red-600"/>,
            loading: <lucide_react_1.Loader2Icon className="size-4 animate-spin"/>,
        }} style={{
            "--normal-bg": "var(--chart-5)",
            "--normal-text": "var(--sidebar-foreground)",
            "--normal-border": "var(--border)",
            "--border-radius": "var(--radius)",
        }} {...props}/>);
};
exports.Toaster = Toaster;
//# sourceMappingURL=sonner.js.map