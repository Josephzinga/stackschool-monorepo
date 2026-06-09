'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columns = void 0;
const badge_1 = require("@/components/ui/badge");
exports.columns = [
    {
        accessorKey: 'name',
        header: 'Groupe',
    },
    {
        accessorKey: 'classes',
        header: 'Classes',
        cell: ({ row }) => {
            const classes = row.original?.classes;
            const twoFirst = classes?.splice(0, 3);
            return (<div>
          {twoFirst.map((cls) => (<badge_1.Badge key={cls?.id}>{cls?.name}</badge_1.Badge>))}
        </div>);
        },
    },
    {
        accessorKey: 'classSubjects.subject',
        header: 'Matières',
        cell: ({ row }) => {
            return (<div>
          {row.original?.classSubjects?.map((cls) => (<badge_1.Badge key={cls?.subject?.id}>{cls?.subject?.name}</badge_1.Badge>))}
        </div>);
        },
    },
    {
        accessorKey: 'classSubject.teacher',
        header: 'Enseignant',
    },
    {
        accessorKey: 'totalCount',
        header: 'Total élèves',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
];
//# sourceMappingURL=columns.js.map