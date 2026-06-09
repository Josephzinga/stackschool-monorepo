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
exports.DeleteSelectedCount = DeleteSelectedCount;
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const React = __importStar(require("react"));
function DeleteSelectedCount({ selectedCount, onClose, onDelete, }) {
    return (<div className="flex items-center gap-2 bg-destructive/15 px-3 py-2 rounded-md border border-red-300">
      <span className="text-sm font-jost font-medium">
        {selectedCount} sélectionné(s)
      </span>
      <button_1.Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive/70" onClick={() => onClose({})}>
        <lucide_react_1.X className="h-4 w-4"/>
      </button_1.Button>
      <div className="h-4 w-px bg-red-200 mx-1"/>
      <button_1.Button variant="ghost" size="sm" className="h-6 px-2 text-destructive text-xs font-medium cursor-pointer hover:text-destructive/70" onClick={() => onDelete(true)}>
        <lucide_react_1.Trash2 className="h-3 w-3 mr-1"/>
        Supprimer
      </button_1.Button>
    </div>);
}
//# sourceMappingURL=delete-selected-count.js.map