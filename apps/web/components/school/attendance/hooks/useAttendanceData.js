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
exports.useAttendanceData = useAttendanceData;
const React = __importStar(require("react"));
const react_1 = require("react");
const attendance_1 = require("@/store/attendance");
const badge_1 = require("@/components/ui/badge");
const avatar_1 = require("@/components/ui/avatar");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const ui_1 = require("@stackschool/ui");
const checkbox_1 = require("@/components/ui/checkbox");
const shared_1 = require("@stackschool/shared");
const useDebounce_1 = require("@/hooks/useDebounce");
const status_radio_group_1 = require("@/components/school/attendance/status-radio-group");
const useAttendanceEvent_1 = require("@/components/school/attendance/hooks/useAttendanceEvent");
const mockStaff = [
    {
        id: 'st1',
        profile: {
            id: 'p6',
            firstName: 'Pierre',
            lastName: 'Roux',
            email: 'pierre@school.com',
        },
        role: 'Administrateur',
        status: 'ABSENT',
    },
    {
        id: 'st2',
        profile: {
            id: 'p7',
            firstName: 'Claire',
            lastName: 'Vincent',
            email: 'claire@school.com',
        },
        role: 'Secrétaire',
        status: 'PRESENT',
    },
];
function useAttendanceData() {
    const { date, tenantId } = (0, attendance_1.useAttendanceStore)();
    const { selectedClass, mode, search } = (0, useAttendanceEvent_1.useAttendanceEvent)();
    const searchTerm = (0, useDebounce_1.useDebounce)(search, 400);
    const day = Object.keys(shared_1.dayMapping).find((day) => shared_1.dayMapping[day] === date.getDay());
    const classesQuery = (0, ui_1.useGetClassesOptionsQuery)({
        input: {
            limit: 100,
        },
    });
    const studentQuery = (0, ui_1.useGetStudentForAttendanceQuery)({
        input: {
            classId: selectedClass,
        },
        date,
    }, {
        enabled: mode === 'STUDENT',
    });
    const teacherQuery = (0, ui_1.useGetTeacherForAttendanceQuery)({
        input: {
            day: day,
            searchTerm,
        },
    }, {
        enabled: mode === 'TEACHER',
    });
    const {} = (0, ui_1.useTeacherForAttendancesQuery)({
        filter: {
            day: day,
            search: searchTerm,
        },
    });
    const rows = (0, react_1.useMemo)(() => {
        switch (mode) {
            case 'STUDENT':
                const students = studentQuery.data?.getSchoolStudents.data || [];
                return students.map((s) => ({
                    id: s.id,
                    profile: s.user?.profile,
                    status: s.attendances?.[0]?.status,
                    class: s.schoolClass,
                    userType: 'STUDENT',
                }));
            case 'TEACHER':
                const teachers = teacherQuery.data?.getSchoolTeachers.data || [];
                return teachers.map((t) => ({
                    id: t.id,
                    profile: t.user?.profile,
                    status: 'PRESENT',
                    userType: 'TEACHER',
                }));
            case 'STAFF':
                const staff = mockStaff || [];
                return staff.map((s) => ({
                    id: s.id,
                    profile: s.profile,
                    status: 'ABSENT',
                    role: s.role,
                    userType: 'STAFF',
                }));
            default:
                return [];
        }
    }, [studentQuery.data, teacherQuery.data, mode]);
    const columns = (0, react_1.useMemo)(() => {
        const baseColumns = [
            {
                id: 'select',
                header: ({ table }) => (<checkbox_1.Checkbox checked={table.getIsAllRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')} className="cursor-pointer" onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}/>),
                cell: ({ row }) => (<checkbox_1.Checkbox className="cursor-pointer" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}/>),
                enableSorting: false,
                enableHiding: false,
                size: 20,
            },
            {
                accessorKey: 'profile',
                header: mode === 'STUDENT'
                    ? 'Élève'
                    : mode === 'TEACHER'
                        ? 'Enseignant'
                        : 'Personnel',
                cell: ({ row }) => <ProfileCell profile={row.original.profile}/>,
            },
        ];
        if (mode === 'STUDENT') {
            baseColumns.push({
                accessorKey: 'class',
                header: 'Classe',
                cell: ({ row }) => row.original.class ? (<badge_1.Badge variant="secondary">{row.original.class.name}</badge_1.Badge>) : null,
                size: 150,
            });
        }
        if (mode === 'TEACHER') {
            baseColumns.push({
                accessorKey: 'class',
            });
        }
        if (mode === 'STAFF') {
            baseColumns.push({
                accessorKey: 'role',
                header: 'Rôle',
                cell: ({ row }) => <badge_1.Badge variant="outline">{row.original.role}</badge_1.Badge>,
                size: 150,
            });
        }
        baseColumns.push({
            accessorKey: 'status',
            header: 'Statut',
            cell: ({ row, table }) => (<status_radio_group_1.StatusBadgeGroup value={row.original?.status} onChange={(status) => table.options.meta?.onChange?.(row.original, status)}/>),
            size: 400,
        });
        if (mode !== 'STUDENT') {
            baseColumns.push({
                id: 'qr',
                header: 'QR',
                cell: ({ row }) => (<button_1.Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                    }}>
            <lucide_react_1.QrCode className="h-4 w-4 text-muted-foreground hover:text-primary"/>
          </button_1.Button>),
                size: 80,
            });
        }
        return baseColumns;
    }, [mode]);
    return {
        rows,
        columns,
        classes: classesQuery.data?.getSchoolClasses.data || [],
        isLoading: teacherQuery.isPending ||
            classesQuery.isPending ||
            studentQuery.isPending,
        isError: teacherQuery.isError || classesQuery.isError || studentQuery.isError,
    };
}
function ProfileCell({ profile, }) {
    return (<div className="flex items-center gap-3">
      <avatar_1.Avatar className="h-9 w-9">
        <avatar_1.AvatarImage src={profile?.photo ?? undefined} alt={`${profile?.firstname} ${profile?.lastname}`}/>
        <avatar_1.AvatarFallback className="bg-primary/10 text-primary">
          {profile?.firstname[0]}
          {profile?.lastname[0]}
        </avatar_1.AvatarFallback>
      </avatar_1.Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {profile?.firstname} {profile?.lastname}
        </span>
        <span className="text-muted-foreground text-xs">{profile?.email}</span>
      </div>
    </div>);
}
//# sourceMappingURL=useAttendanceData.js.map