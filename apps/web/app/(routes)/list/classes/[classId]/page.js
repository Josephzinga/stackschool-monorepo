'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClassDetailsPage;
const ui_1 = require("@stackschool/ui");
const navigation_1 = require("next/navigation");
const spinner_1 = require("@/components/ui/spinner");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const separator_1 = require("@/components/ui/separator");
const teacher_view_1 = require("@/components/school/class/teacher-view");
const class_student_list_1 = require("@/components/school/class/class-student-list");
const today_subjects_1 = require("@/components/school/class/today-subjects");
const schedule_grid_1 = __importDefault(require("@/components/school/class/schedule/schedule-grid"));
const app_tabs_1 = require("@/components/app-tabs");
const subjects_view_1 = require("@/components/school/class-subject/subject-view/subjects-view");
function ClassDetailsPage() {
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const classId = params.classId;
    const { data, isLoading, error } = (0, ui_1.useGetClassDetailsQuery)({ id: classId }, { enabled: !!classId });
    if (isLoading) {
        return (<div className="h-screen w-full flex items-center justify-center">
        <spinner_1.Spinner className="h-8 w-8 text-primary"/>
      </div>);
    }
    if (error || !data?.class) {
        return (<div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Classe introuvable.</p>
        <button_1.Button variant="outline" onClick={() => router.back()}>
          Retour
        </button_1.Button>
      </div>);
    }
    const classData = data.class;
    const supervisor = classData.supervisor;
    const supervisorProfile = supervisor?.user?.profile;
    const femaleCount = classData._count?.students?.female || 0;
    const maleCount = classData._count?.students?.male || 0;
    const totalCount = femaleCount + maleCount;
    return (<div className="flex-1 p-2 md:p-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      <div className=" flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button_1.Button variant="ghost" size="icon" onClick={() => router.back()}>
            <lucide_react_1.ArrowLeft className="h-5 w-5"/>
          </button_1.Button>
          <div className="">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                {classData.name}
              </h1>
              <badge_1.Badge variant="outline" className="text-xs md:text-sm">
                {classData.level}
              </badge_1.Badge>
              {classData.section && (<badge_1.Badge variant="secondary" className="text-xs md:text-sm">
                  Section {classData.section}
                </badge_1.Badge>)}
              <badge_1.Badge variant="outline" className="text-xs md:text-sm">
                2025 - 2026
              </badge_1.Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <lucide_react_1.Users className="h-4 w-4"/>
              <span>
                {totalCount}
                élèves
              </span>
              <span>•</span>
              <lucide_react_1.BookOpen className="h-4 w-4"/>
              <span>{classData?._count?.subjects} matières</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button_1.Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
            Modifier
          </button_1.Button>
          <button_1.Button variant="destructive" size="icon" className="shrink-0">
            <lucide_react_1.Trash2 className="h-4 w-4"/>
          </button_1.Button>
        </div>
      </div>

      <separator_1.Separator />

      
      <app_tabs_1.AppTabs defaultValue="overview">
        <app_tabs_1.AppTabsList>
          <app_tabs_1.AppTabsTrigger value="overview">Aperçu</app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="students">
            Élèves ({totalCount})
          </app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="subjects">
            Matières ({classData?._count?.subjects})
          </app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="teachers">Équipe Pédagogique</app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="schedule">Emploi du temps</app_tabs_1.AppTabsTrigger>
        </app_tabs_1.AppTabsList>

        
        <app_tabs_1.AppTabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-6">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-lg flex items-center gap-2">
                    <lucide_react_1.User className="h-5 w-5 text-primary"/>
                    Professeur Principal
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  {supervisor ? (<div className="flex items-center gap-4">
                      <avatar_1.Avatar className="h-12 w-12">
                        <avatar_1.AvatarImage src={supervisorProfile?.photo || undefined}/>
                        <avatar_1.AvatarFallback>
                          {supervisorProfile?.firstname?.[0]}
                          {supervisorProfile?.lastname?.[0]}
                        </avatar_1.AvatarFallback>
                      </avatar_1.Avatar>
                      <div>
                        <p className="font-medium">
                          {supervisorProfile?.firstname}{' '}
                          {supervisorProfile?.lastname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {supervisor.user?.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {supervisor.user?.phoneNumber}
                        </p>
                      </div>
                    </div>) : (<p className="text-muted-foreground italic">
                      Aucun professeur principal assigné.
                    </p>)}
                </card_1.CardContent>
              </card_1.Card>

              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    Effectif
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="text-3xl font-bold">{totalCount}</div>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="font-medium">{maleCount}</span> Garçons
                    </div>
                    <div className="flex items-center gap-1 text-pink-600">
                      <span className="font-medium">{femaleCount}</span> Filles
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>

            
            <today_subjects_1.TodaySubjects classId={classId}/>
          </div>
        </app_tabs_1.AppTabsContent>

        
        <app_tabs_1.AppTabsContent value="students" className="mt-6">
          <class_student_list_1.ClassStudentList classId={classId}/>
        </app_tabs_1.AppTabsContent>
        
        <app_tabs_1.AppTabsContent value="subjects">
          <subjects_view_1.ClassSubjectsView classId={classId}/>
        </app_tabs_1.AppTabsContent>
        
        <app_tabs_1.AppTabsContent value="teachers" className="mt-6">
          <teacher_view_1.TeacherView classId={classId}/>
        </app_tabs_1.AppTabsContent>

        
        <app_tabs_1.AppTabsContent value="schedule" className="mt-6">
          <schedule_grid_1.default classId={classId}/>
        </app_tabs_1.AppTabsContent>
      </app_tabs_1.AppTabs>
    </div>);
}
//# sourceMappingURL=page.js.map