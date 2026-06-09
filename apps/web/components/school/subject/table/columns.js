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
exports.columns = void 0;
const checkbox_1 = require("@/components/ui/checkbox");
const React = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const avatar_1 = require("@/components/ui/avatar");
const subject_table_action_1 = require("@/components/school/subject/table/subject-table-action");
const badge_1 = require("@/components/ui/badge");
const tooltip_1 = require("@/components/ui/tooltip");
const constant_1 = require("@/constant");
exports.columns = [
    {
        id: 'select',
        header: ({ table }) => (<checkbox_1.Checkbox checked={table.getIsAllRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')} className="cursor-pointer" onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}/>),
        cell: ({ row }) => (<checkbox_1.Checkbox className="cursor-pointer" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}/>),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Matière.',
    },
    {
        accessorKey: 'classes',
        header: 'Classe.',
        cell: ({ row }) => {
            const classes = row.original.classes?.map((cls) => cls?.map((cl) => cl?.name));
            const displayCount = 2;
            let remainingCount = 0;
            if (classes) {
                remainingCount = classes?.length - displayCount;
            }
            if (classes?.length === 0)
                return (<span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>);
            return (<div className="flex items-center gap-1">
          {classes?.slice(0, displayCount).map((className, index) => (<badge_1.Badge key={index} variant="outline" className="whitespace-nowrap text-xs">
              {className}
            </badge_1.Badge>))}

          {remainingCount > 0 && classes?.length > 0 && (<tooltip_1.TooltipProvider>
              <tooltip_1.Tooltip>
                <tooltip_1.TooltipTrigger asChild>
                  <span className="text-xs bg-accent px-1.5 py-0.5 rounded cursor-help">
                    + {remainingCount}
                  </span>
                </tooltip_1.TooltipTrigger>
                <tooltip_1.TooltipContent>
                  <p className="text-xs">
                    {classes?.slice(displayCount).join(', ')}
                  </p>
                </tooltip_1.TooltipContent>
              </tooltip_1.Tooltip>
            </tooltip_1.TooltipProvider>)}
        </div>);
        },
    },
    {
        accessorKey: 'mainTeacher',
        header: 'Professeur.',
        cell: ({ row }) => {
            const photo = row.original?.mainTeacher?.photo;
            const lastname = row.original.mainTeacher?.lastname;
            const firstname = row.original.mainTeacher?.firstname;
            if (!row.original.mainTeacher?.id)
                return (<span className="text-muted-foreground text-xs italic">
            Non assignée
          </span>);
            return (<link_1.default href={`/list/teachers/${row?.original?.mainTeacher?.id}`} className="block w-full h-full">
          <div className="flex gap-3 items-center p-1 rounded-md transition-colors cursor-pointer">
            <avatar_1.Avatar className="h-10 w-10">
              <avatar_1.AvatarImage src={photo ?? undefined}/>
              <avatar_1.AvatarFallback className="bg-primary/10 text-primary text-xs">
                {firstname?.[0]}
                {lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm hover:underline hover:underline-offset-2 text-foreground">
                {firstname} {lastname}
              </span>
            </div>
          </div>
        </link_1.default>);
        },
    },
    {
        accessorKey: 'category',
        header: 'Catégorie',
        cell: ({ row }) => {
            const category = row.original?.category;
            return (<badge_1.Badge className="text-xs font-medium font-sans">
          {constant_1.categoryMap.find((c) => c.value === category)?.label}
        </badge_1.Badge>);
        },
    },
    {
        accessorKey: 'totalWeeklyHours',
        header: 'H/sem.',
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => <subject_table_action_1.SubjectTableAction row={row}/>,
    },
];
//# sourceMappingURL=columns.js.map