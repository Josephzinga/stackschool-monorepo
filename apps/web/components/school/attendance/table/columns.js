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
exports.studentColumns = void 0;
const radio_group_1 = require("@/components/ui/radio-group");
const label_1 = require("@/components/ui/label");
const checkbox_1 = require("@/components/ui/checkbox");
const React = __importStar(require("react"));
const ui_1 = require("@stackschool/ui");
const link_1 = __importDefault(require("next/link"));
const avatar_1 = require("@/components/ui/avatar");
exports.studentColumns = [
    {
        id: 'select',
        header: ({ table }) => (<checkbox_1.Checkbox checked={table.getIsAllRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')} className="cursor-pointer" onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}/>),
        cell: ({ row }) => (<checkbox_1.Checkbox className="cursor-pointer" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}/>),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'profile',
        header: ({ column, header, table }) => {
            console.log('column', column, '\n header', header);
            return <div>Élèves</div>;
        },
        cell: ({ row }) => {
            const { firstname, lastname, photo } = row.original.profile;
            const mode = row.original.mode;
            return (<link_1.default href={`/list/students/${row.original.id}`} className="block max-w-80 md:max-w-100 h-full">
          <div className="flex gap-2 items-center hover:bg-accent rounded-md transition-colors cursor-pointer">
            <avatar_1.Avatar className="h-10 w-10">
              <avatar_1.AvatarImage src={photo ?? undefined}/>
              <avatar_1.AvatarFallback className="bg-primary/10 text-primary text-xs">
                {firstname?.[0]}
                {lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {firstname} {lastname}
              </span>
            </div>
          </div>
        </link_1.default>);
        },
        size: 300,
    },
    {
        accessorKey: 'class',
        header: 'Classe',
        cell: ({ row }) => <div>{row.original.class?.name}</div>,
        size: 150,
    },
    {
        id: 'status',
        header: 'Statut de Présence',
        cell: ({ row }) => {
            const studentId = row.original.id;
            return (<radio_group_1.RadioGroup defaultValue={ui_1.AttendanceStatus.Present} onValueChange={(val) => console.log(val)} className="flex gap-2">
          <div className="flex items-center space-x-2">
            <radio_group_1.RadioGroupItem value={ui_1.AttendanceStatus.Present} id={`p-${studentId}`} className="bg-green-500"/>
            <label_1.Label htmlFor={`p-${studentId}`}>P</label_1.Label>
          </div>
          <div className="flex items-center space-x-2">
            <radio_group_1.RadioGroupItem value={ui_1.AttendanceStatus.Absent} id={`a-${studentId}`} className="bg-red-500"/>
            <label_1.Label htmlFor={`a-${studentId}`}>A</label_1.Label>
          </div>
          <div className="flex items-center space-x-2">
            <radio_group_1.RadioGroupItem value={ui_1.AttendanceStatus.Late} id={`a-${studentId}`} className="bg-yellow-400"/>
            <label_1.Label htmlFor={`a-${studentId}`}>R</label_1.Label>
          </div>
        </radio_group_1.RadioGroup>);
        },
        size: 400,
    },
];
//# sourceMappingURL=columns.js.map