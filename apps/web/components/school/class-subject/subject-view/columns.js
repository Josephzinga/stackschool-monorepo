'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columns = void 0;
const badge_1 = require("@/components/ui/badge");
const subject_view_action_1 = require("@/components/school/class-subject/subject-view/subject-view-action");
exports.columns = [
    {
        accessorKey: 'subject.name',
        header: 'Matière',
        cell: ({ row }) => (<div className="font-medium ml-2 font-inter text-sm">
        {row.original?.subject?.name}
        <span className="ml-2 text-xs text-muted-foreground">
          [{row.original?.subject?.code}]
        </span>
      </div>),
    },
    {
        accessorKey: 'coefficient',
        header: 'Coefficient',
        cell: ({ row }) => (<badge_1.Badge variant="secondary" className="font-medium font-inter">
        {row.original?.coefficient || 0}
      </badge_1.Badge>),
    },
    {
        accessorKey: 'weeklyHours',
        header: 'H/S',
        cell: ({ row }) => (<span className="text-sm font-semibold">
        {row.original?.weeklyHours || 0} h
      </span>),
    },
    {
        accessorKey: 'teacher',
        header: 'Enseignant',
        cell: ({ row }) => {
            const profile = row.original?.teacher?.user?.profile;
            if (!profile)
                return (<span className="italic opacity-80 text-[12px]">Non assigné</span>);
            return (<span className="text-sm">
          {profile?.firstname} {profile?.lastname}
        </span>);
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => (<subject_view_action_1.SubjectViewAction row={row} meta={table.options.meta}/>),
    },
];
//# sourceMappingURL=columns.js.map