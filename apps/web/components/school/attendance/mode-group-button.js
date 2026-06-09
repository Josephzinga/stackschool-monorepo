'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeButtonGroup = ModeButtonGroup;
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
const react_1 = require("motion/react");
const react_2 = require("react");
const modes = [
    {
        value: 'STUDENT',
        label: 'Élèves',
        icon: <lucide_react_1.GraduationCap className="h-4 w-4"/>,
    },
    {
        value: 'TEACHER',
        label: 'Enseignants',
        icon: <lucide_react_1.Users className="h-4 w-4"/>,
    },
    {
        value: 'STAFF',
        label: 'Personnel',
        icon: <lucide_react_1.Briefcase className="h-4 w-4"/>,
    },
];
function ModeButtonGroup({ activeMode, onModeChange, }) {
    const [activeIndex, setActiveIndex] = (0, react_2.useState)(null);
    return (<react_1.motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.2, delay: 0.05 }} className="inline-flex rounded-lg border bg-muted p-1 max-w-md">
      {modes.map((mode, i) => (<button key={mode.value} onClick={() => onModeChange(mode.value)} className={(0, utils_1.cn)('inline-flex cursor-pointer items-center w-full gap-2 rounded-md px-6 py-1.5 text-sm font-medium transition-all', activeMode === mode.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground')}>
          {mode.icon}
          {mode.label}
        </button>))}
    </react_1.motion.div>);
}
//# sourceMappingURL=mode-group-button.js.map