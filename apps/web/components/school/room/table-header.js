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
exports.RoomTableHeader = RoomTableHeader;
const data_filters_1 = __importDefault(require("@/components/school/data-filters"));
const nuqs_1 = require("nuqs");
const button_1 = require("@/components/animate-ui/components/buttons/button");
const lucide_react_1 = require("lucide-react");
const React = __importStar(require("react"));
const ROOM_COLUMNS = [
    { id: 'name', label: 'Sale' },
    { id: 'capacity', label: 'Place' },
    { id: 'type', label: 'Type' },
    { id: 'class', label: 'Classe occupé' },
    { id: 'code', label: 'Code' },
];
function RoomTableHeader() {
    const [searchTerm, setSearchTerm] = (0, nuqs_1.useQueryState)('search');
    return (<div className="flex flex-col md:flex-row gap-2 items-center justify-between">
      <data_filters_1.default columns={ROOM_COLUMNS} hasActiveFilters={false} inputPlaceholder="Rechercher une salle..." showFilters={false} search={searchTerm ?? undefined} onSearchChange={setSearchTerm}/>

      <button_1.Button className="w-full sm:w-40">
        <lucide_react_1.Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
        <span className="sm:hidden">Ajouter</span>
        <span className="hidden sm:inline font-medium">Ajouter une salle</span>
      </button_1.Button>
    </div>);
}
//# sourceMappingURL=table-header.js.map