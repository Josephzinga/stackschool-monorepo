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
exports.SearchResultsList = SearchResultsList;
const react_1 = __importStar(require("react"));
const utils_1 = require("@/lib/utils");
const gsap_1 = __importDefault(require("gsap"));
const react_2 = require("@gsap/react");
function SearchResultsList({ items, renderItem, onSelect, className, }) {
    const containerRef = (0, react_1.useRef)(null);
    (0, react_2.useGSAP)(() => {
        if (!items.length || !containerRef.current)
            return;
        const children = containerRef.current.children;
        gsap_1.default.fromTo(children, { autoAlpha: 0, y: -10 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'all',
        });
    }, { dependencies: [items], scope: containerRef });
    if (!items || items.length === 0) {
        return null;
    }
    return (<div ref={containerRef} className={(0, utils_1.cn)('absolute z-50 w-full mt-1 border rounded-md bg-white dark:bg-slate-900 shadow-lg max-h-60 overflow-y-auto overflow-x-hidden', className)}>
      {items.map((item) => (<div key={item.id} className={(0, utils_1.cn)('cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800', 'border-b last:border-0 border-slate-100 dark:border-slate-800')} onClick={() => onSelect(item)}>
          {renderItem(item)}
        </div>))}
    </div>);
}
//# sourceMappingURL=search-results-list.js.map