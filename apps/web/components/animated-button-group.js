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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedButtonGroup = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const utils_1 = require("@/lib/utils");
const AnimatedButtonGroup = ({ children, className = '', gap = 8, direction = 'horizontal', }) => {
    const [activeIndex, setActiveIndex] = (0, react_1.useState)(null);
    return (<framer_motion_1.motion.div className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} items-center ${className}`} style={{ gap: `${gap}px` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <framer_motion_1.AnimatePresence>
        {react_1.default.Children.map(children, (child, i) => (<framer_motion_1.motion.div key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.2, delay: i * 0.05 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveIndex(i)} className={(0, utils_1.cn)(activeIndex === 1 ? 'z-10' : 'z-0')}>
            {child}
          </framer_motion_1.motion.div>))}
      </framer_motion_1.AnimatePresence>
    </framer_motion_1.motion.div>);
};
exports.AnimatedButtonGroup = AnimatedButtonGroup;
function ButtonGroupExample() {
    const [resourceMode, setResourceMode] = (0, react_1.useState)('CLASS');
    return <div className="flex flex-col gap-4 p-4"></div>;
}
exports.default = ButtonGroupExample;
//# sourceMappingURL=animated-button-group.js.map