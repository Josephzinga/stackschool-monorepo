'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherDetailsPage;
const ui_1 = require("@stackschool/ui");
const navigation_1 = require("next/navigation");
const spinner_1 = require("@/components/ui/spinner");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const react_1 = require("react");
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const sonner_1 = require("sonner");
const schedule_grid_1 = __importDefault(require("@/components/school/teacher/schedule-grid"));
const classes_section_1 = __importDefault(require("@/components/school/teacher/classes-section"));
const info_item_1 = require("@/components/school/info-item");
const app_tabs_1 = require("@/components/app-tabs");
const sheet_1 = require("@/components/ui/sheet");
const shortHands = [
    { value: 'classes', label: 'Classes', href: '/list/classes' },
    { value: 'lessons', label: 'Leçons', href: '/list/lessons' },
    { value: 'subject', label: 'Matières', href: '/list/subject' },
    { value: 'students', label: 'Élèves', href: '/list/students' },
];
function TeacherDetailsPage() {
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const teacherId = params.teacherId;
    const { currentSchool } = (0, ui_1.useUserStore)();
    const [showDeleteAlert, setShowDeleteAlert] = (0, react_1.useState)(false);
    const [openSheet, setOpenSheet] = (0, react_1.useState)(false);
    const { data, isLoading, error } = (0, ui_1.useGetTeacherDetailsQuery)({ id: teacherId }, { enabled: !!teacherId });
    const { mutateAsync, isPending: isDeleting } = (0, ui_1.useDeleteTeachersMutation)();
    const handleDelete = async () => {
        if (!currentSchool?.id)
            return;
        const promise = mutateAsync({
            teacherIds: [teacherId],
            schoolId: currentSchool.id,
        });
        sonner_1.toast.promise(promise, {
            loading: 'Suppression en cours...',
            success: 'Professeur supprimé',
            error: 'Erreur lors de la suppression',
        });
        try {
            await promise;
            router.push('/list/teachers');
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleShortcut = (href) => {
        router.push(`${href}?teacherId=${teacherId}`);
    };
    if (isLoading) {
        return (<div className="h-screen w-full flex items-center justify-center">
        <spinner_1.Spinner className="h-8 w-8 text-primary"/>
      </div>);
    }
    if (error || !data?.teacher) {
        return (<div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Enseignant introuvable.</p>
        <button_1.Button variant="outline" onClick={() => router.back()}>
          Retour
        </button_1.Button>
      </div>);
    }
    const teacher = data.teacher;
    const profile = teacher.user?.profile;
    return (<div className="flex-1 sm:p-4 flex justify-center gap-4 ">
      

      <div className="w-full h-full py-2 space-y-4 max-w-350 px-3">
        <card_1.CardHeader className=" px-2 flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <button_1.Button variant="ghost" size="icon" onClick={() => router.back()}>
              <lucide_react_1.ArrowLeft className="h-5 w-5"/>
            </button_1.Button>

            <div className="flex gap-2">
              <button_1.Button onClick={() => setOpenSheet(true)} variant="outline" size="sm">
                <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                Modifier
              </button_1.Button>
              <button_1.Button variant="destructive" size="sm" onClick={() => setShowDeleteAlert(true)}>
                <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                Supprimer
              </button_1.Button>
            </div>
          </div>
          <div className="flex items-center py-4 md:p-4 rounded-md bg-accent h-full w-full gap-4 md:gap-6">
            <div className="h-full flex items-center max-w-50 max-h-50 justify-center">
              <avatar_1.Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-sm">
                <avatar_1.AvatarImage className="object-cover" src={profile?.photo || undefined}/>
                <avatar_1.AvatarFallback className="text-3xl bg-primary/10 font-jost text-primary">
                  {profile?.firstname?.[0]}
                  {profile?.lastname?.[0]}
                </avatar_1.AvatarFallback>
              </avatar_1.Avatar>
            </div>
            <div className="w-full space-y-2 md:space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile?.firstname} {profile?.lastname}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {teacher.specialization || 'Enseignant'}
              </p>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-2 w-full pr-1">
                  <info_item_1.InfoItem icon={lucide_react_1.Phone}>
                    {teacher.user?.phoneNumber || 'Non renseigné'}
                  </info_item_1.InfoItem>
                  <info_item_1.InfoItem icon={lucide_react_1.Mail}>
                    {teacher.user?.email || 'Non renseigné'}
                  </info_item_1.InfoItem>
                  <info_item_1.InfoItem icon={lucide_react_1.MapPin}>
                    {profile?.address || 'Adresse non renseignée'}
                  </info_item_1.InfoItem>
                  <info_item_1.InfoItem icon={lucide_react_1.ActivityIcon}>
                    <badge_1.Badge variant={teacher.isActive ? 'default' : 'secondary'} className="h-5 text-xs px-2">
                      {teacher.isActive ? 'Actif' : 'Inactif'}
                    </badge_1.Badge>
                  </info_item_1.InfoItem>
                </div>
              </div>
            </div>
          </div>
        </card_1.CardHeader>

        <div className="flex-1">
          <app_tabs_1.AppTabs defaultValue="overview" className="">
            <app_tabs_1.AppTabsList className="rounded-lg mb-2">
              <app_tabs_1.AppTabsTrigger value="overview">Aperçu</app_tabs_1.AppTabsTrigger>
              <app_tabs_1.AppTabsTrigger value="classes">
                Classes ({teacher.classSubjects?.length || 0})
              </app_tabs_1.AppTabsTrigger>
              <app_tabs_1.AppTabsTrigger value="schedule">Emploi du temps</app_tabs_1.AppTabsTrigger>
            </app_tabs_1.AppTabsList>
            <app_tabs_1.AppTabsContent value="overview">
              <card_1.Card className="">
                <card_1.CardHeader className="flex justify-end pt-0">
                  <button_1.Button variant="outline" size={'icon'}>
                    <lucide_react_1.MoreHorizontal />
                  </button_1.Button>
                </card_1.CardHeader>
                <card_1.CardContent className="grid h-full grid-cols-1 md:grid-cols-2 px-2 md:px-4  gap-6">
                  <card_1.Card className="h-full">
                    <card_1.CardHeader>
                      <card_1.CardTitle className="text-lg">
                        Informations Professionnelles
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <lucide_react_1.GraduationCap className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            Diplôme
                          </span>
                          <span className="font-medium">
                            {teacher.diploma || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <lucide_react_1.Briefcase className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            Département
                          </span>
                          <span className="font-medium">
                            {teacher.departement || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 flex items-center justify-center font-bold text-muted-foreground text-xs border rounded-full">
                          Hr
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            Volume Horaire
                          </span>
                          <span className="font-medium">
                            {teacher.weeklyHours}h / semaine
                          </span>
                        </div>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle className="text-lg">Biographie</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {teacher?.bio}
                      </p>
                    </card_1.CardContent>
                  </card_1.Card>
                </card_1.CardContent>
              </card_1.Card>
            </app_tabs_1.AppTabsContent>

            <app_tabs_1.AppTabsContent value="classes">
              <card_1.Card>
                <card_1.CardHeader className="flex w-full justify-end">
                  <button_1.Button variant="outline" size="icon">
                    <lucide_react_1.MoreHorizontal className="h-10 w-10"/>
                  </button_1.Button>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <classes_section_1.default classSubject={teacher?.classSubjects}/>
                </card_1.CardContent>
              </card_1.Card>
            </app_tabs_1.AppTabsContent>

            <app_tabs_1.AppTabsContent value="schedule">
              <schedule_grid_1.default id={teacherId}/>
            </app_tabs_1.AppTabsContent>
          </app_tabs_1.AppTabs>
        </div>
      </div>

      <alert_dialog_1.AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <alert_dialog_1.AlertDialogContent>
          <alert_dialog_1.AlertDialogHeader>
            <alert_dialog_1.AlertDialogTitle>Supprimer ce professeur ?</alert_dialog_1.AlertDialogTitle>
            <alert_dialog_1.AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées seront
              supprimées.
            </alert_dialog_1.AlertDialogDescription>
          </alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogFooter>
            <alert_dialog_1.AlertDialogCancel disabled={isDeleting}>Annuler</alert_dialog_1.AlertDialogCancel>
            <alert_dialog_1.AlertDialogAction onClick={(e) => {
            e.preventDefault();
            handleDelete();
        }} className="bg-red-600 hover:bg-red-700 focus:ring-red-600" disabled={isDeleting}>
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </alert_dialog_1.AlertDialogAction>
          </alert_dialog_1.AlertDialogFooter>
        </alert_dialog_1.AlertDialogContent>
      </alert_dialog_1.AlertDialog>

      <sheet_1.Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <sheet_1.SheetContent side="right">
          <sheet_1.SheetHeader></sheet_1.SheetHeader>
        </sheet_1.SheetContent>
      </sheet_1.Sheet>
    </div>);
}
//# sourceMappingURL=page.js.map