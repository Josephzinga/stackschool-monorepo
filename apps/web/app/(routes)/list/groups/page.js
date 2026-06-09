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
exports.default = GroupsPage;
const react_1 = __importStar(require("react"));
const data_table_1 = require("@/components/school/group/data-table");
const columns_1 = require("@/components/school/group/columns");
const data_filters_1 = __importDefault(require("@/components/school/data-filters"));
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
function GroupsPage() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [open, setOpen] = (0, react_1.useState)(false);
    return (<div className="flex flex-col h-full p-3 md:p-6 z-10 gap-3">
      <div className="flex justify-between ">
        <data_filters_1.default hasActiveFilters={false} showFilters={false} search={searchTerm} onSearchChange={setSearchTerm}/>
        <button_1.Button className="border-dashed!" onClick={() => setOpen(true)}>
          Creé un groupe d'élèves
        </button_1.Button>
      </div>
      <data_table_1.GroupDataTable data={[]} isLoading={false} columns={columns_1.columns}/>

      <dialog_1.Dialog open={open} onOpenChange={setOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle></dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
//# sourceMappingURL=page.js.map