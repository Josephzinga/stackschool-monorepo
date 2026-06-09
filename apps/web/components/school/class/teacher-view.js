'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherView = TeacherView;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const avatar_1 = require("@/components/ui/avatar");
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const tooltip_1 = require("@/components/ui/tooltip");
const skeleton_1 = require("@/components/ui/skeleton");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const framer_motion_1 = require("framer-motion");
const ui_1 = require("@stackschool/ui");
const assignment_form_1 = require("@/components/school/teacher/form/assignment-form");
function TeacherView({ classId }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [initialValues, setInitialValues] = (0, react_1.useState)();
    const { data, isError, error, isPending } = (0, ui_1.useGetTeachersTeamQuery)({
        classId: classId,
    });
    const teachersTeam = data?.class?.teachingTeamMembers?.map((member) => ({
        id: member.teacher.id,
        firstname: member.teacher?.user?.profile?.firstname ?? '',
        lastname: member.teacher?.user?.profile?.lastname ?? '',
        photo: member.teacher?.user?.profile?.photo,
        assignments: member.assignments.map((assignment) => ({
            id: assignment.id,
            subject: assignment.subject,
        })),
    }));
    const handleAddSuccess = () => {
        setOpen(false);
    };
    const handleDialog = ({ isUpdate = false, teacherId, assignments, }) => {
        isUpdate
            ? setInitialValues({
                classId: classId,
                teacherId,
                assignments,
            })
            : setInitialValues({ classId });
        setOpen(true);
    };
    if (isError) {
        return (<card_1.Card className="p-6">
        <card_1.CardContent className="text-center text-destructive">
          <p>Erreur lors du chargement de l'équipe pédagogique.</p>
          <p className="text-sm text-muted-foreground">{error?.message}</p>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card className="w-full overflow-hidden">
      <card_1.CardHeader className="border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <card_1.CardTitle className="text-xl font-semibold flex items-center gap-2">
            <lucide_react_1.UserPlus className="h-5 w-5 text-primary"/>
            Équipe Pédagogique
          </card_1.CardTitle>
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger asChild>
                <button_1.Button onClick={() => handleDialog({})} variant="outline" size="sm" className="gap-1">
                  <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                  <span className="hidden sm:inline">Ajouter</span>
                </button_1.Button>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent>
                <p className="text-xs">Ajouter un enseignant à cette classe</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>
        </div>
      </card_1.CardHeader>

      <card_1.CardContent className="p-4">
        {isPending ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (<div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                <skeleton_1.Skeleton className="h-12 w-12 rounded-full"/>
                <div className="space-y-2 flex-1">
                  <skeleton_1.Skeleton className="h-5 w-32"/>
                  <skeleton_1.Skeleton className="h-4 w-24"/>
                </div>
              </div>))}
          </div>) : teachersTeam && teachersTeam.length === 0 ? (<div className="text-center py-12 text-muted-foreground">
            <lucide_react_1.UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30"/>
            <p>Aucun enseignant n'est encore assigné à cette classe.</p>
            <button_1.Button variant="link" onClick={() => setOpen(true)} className="mt-2">
              Ajouter un enseignant
            </button_1.Button>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {teachersTeam?.map((teacher) => (<TeacherCard key={teacher.id} teacher={teacher} onOptionClick={() => handleDialog({
                    isUpdate: true,
                    teacherId: teacher.id,
                    assignments: teacher.assignments.map((ass) => ({
                        id: ass.id,
                        subjectId: ass.subject.id,
                    })),
                })}/>))}
          </div>)}
      </card_1.CardContent>
      {open && (<dialog_1.Dialog open={open} modal={false} onOpenChange={setOpen}>
          <dialog_1.DialogContent className="sm:max-w-lg rounded-xl!">
            <div className="space-y-6">
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle>Ajouter un enseignant à la classe</dialog_1.DialogTitle>
              </dialog_1.DialogHeader>

              <assignment_form_1.TeacherAssignmentForm initialValues={initialValues} onSuccess={() => setOpen(false)}/>
            </div>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>)}
    </card_1.Card>);
}
const TeacherCard = ({ teacher, onOptionClick, }) => {
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <card_1.Card className="group pt-0 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md">
        <card_1.CardContent className="p-4">
          <div className="flex w-full justify-end ">
            <button_1.Button onClick={onOptionClick} variant="ghost" className="h-8">
              <lucide_react_1.MoreHorizontal />
            </button_1.Button>
          </div>
          <div className="flex items-start gap-4">
            <avatar_1.Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <avatar_1.AvatarImage src={teacher.photo ?? undefined}/>
              <avatar_1.AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {teacher.firstname?.[0]}
                {teacher.lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div className="flex-1 min-w-0">
              <link_1.default href={`/list/teachers/${teacher.id}`} className="font-semibold text-base hover:text-primary hover:underline underline-offset-2 transition-colors">
                {teacher.firstname} {teacher.lastname}
              </link_1.default>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {teacher.assignments?.map((ass) => (<badge_1.Badge key={ass.id} variant="secondary" className="text-xs gap-1 px-2 py-0.5">
                    <lucide_react_1.BookOpen className="h-3 w-3"/>
                    {ass.subject.name}
                  </badge_1.Badge>))}
                {teacher.assignments?.length === 0 && (<span className="text-xs text-muted-foreground italic">
                    Aucune matière assignée
                  </span>)}
              </div>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </framer_motion_1.motion.div>);
};
//# sourceMappingURL=teacher-view.js.map