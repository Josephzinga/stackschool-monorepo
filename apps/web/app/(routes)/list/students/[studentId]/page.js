'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudentDetailsPage;
const ui_1 = require("@stackschool/ui");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const separator_1 = require("@/components/ui/separator");
const app_tabs_1 = require("@/components/app-tabs");
const react_1 = require("react");
const dialog_1 = require("@/components/ui/dialog");
const file_upload_1 = require("@/components/ui/file-upload");
const sonner_1 = require("sonner");
const shared_1 = require("@stackschool/shared");
const update_student_details_1 = require("@/components/school/student/update-student-details");
const tabs_overview_1 = require("@/components/school/student/tabs-overview");
function StudentDetailsPage() {
    const [openSheet, setOpenSheet] = (0, react_1.useState)(false);
    const [openingDialog, setOpeningDialog] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const studentId = params.studentId;
    const { currentSchool } = (0, ui_1.useUserStore)();
    const { data, isPending, error } = (0, ui_1.useGetStudentDetailsQuery)({ id: studentId }, { enabled: !!studentId && !!currentSchool?.id });
    if (isPending)
        return <lucide_react_1.Loader />;
    if (error || !data?.student) {
        return (<div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Élève introuvable.</p>
        <button_1.Button variant="outline" onClick={() => router.back()}>
          Retour
        </button_1.Button>
      </div>);
    }
    const student = data.student;
    const profile = student?.user?.profile;
    const handlePhotoUpload = async (files) => {
        const file = files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            sonner_1.toast.warning('Veuillez sélectionner une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            sonner_1.toast.warning("L'image doit faire moins de 5MB");
            return;
        }
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('profilePicture', file);
            const res = await shared_1.api.post('/api/upload/profile-picture', formData);
            const data = res.data;
            if (data.ok) {
                sonner_1.toast.success(`${res.data.message}` || 'Photo de profil téléchargée avec succès !');
            }
            else {
                throw new Error(data.message);
            }
        }
        catch (error) {
            const { message, status, data } = (0, shared_1.parseAxiosError)(error);
            sonner_1.toast.error(message || 'Erreur lors du téléchargement de la photo');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="flex-1 p-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center xl:mt-4 gap-4">
        <div className="flex items-center gap-4">
          <button_1.Button variant="ghost" size="icon" onClick={() => router.back()}>
            <lucide_react_1.ArrowLeft className="h-5 w-5"/>
          </button_1.Button>
          <div className="flex items-center gap-4">
            <avatar_1.Avatar onClick={() => setOpeningDialog(true)} className="h-16 w-16 md:h-20 md:w-20 border-2 border-background shadow-sm">
              <avatar_1.AvatarImage src={profile?.photo || undefined}/>
              <avatar_1.AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                {profile?.firstname?.[0]}
                {profile?.lastname?.[0]}
              </avatar_1.AvatarFallback>
            </avatar_1.Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile?.firstname} {profile?.lastname}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <badge_1.Badge variant="outline" className="font-mono">
                  {student.matricule}
                </badge_1.Badge>
                <span>•</span>
                <span className="font-medium text-foreground">
                  {student.schoolClass?.name || 'Sans classe'}
                </span>
              </div>
              <div className="flex gap-2 text-sm opacity-90 font-sans">
                Compte utilisateur:
                <badge_1.Badge variant={student?.user?.isActive ? 'default' : 'destructive'}>
                  {student?.user?.isActive ? 'Actif' : 'Inactif'}
                </badge_1.Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button_1.Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <lucide_react_1.Printer className="h-4 w-4 mr-2"/>
            Imprimer
          </button_1.Button>
          <button_1.Button onClick={() => setOpenSheet(true)} variant="outline" size="sm" className="flex-1 md:flex-none">
            <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
            Modifier
          </button_1.Button>
          <button_1.Button variant="destructive" size="icon" className="shrink-0">
            <lucide_react_1.Trash2 className="h-4 w-4"/>
          </button_1.Button>
        </div>
      </div>

      <separator_1.Separator />

      
      <app_tabs_1.AppTabs defaultValue="overview" className="w-full">
        <app_tabs_1.AppTabsList className="w-full bg-accent/70 rounded-sm justify-start border-b p-0 h-auto overflow-x-auto">
          <app_tabs_1.AppTabsTrigger value="overview">Aperçu</app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="results">Résultats</app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="finance">Finances</app_tabs_1.AppTabsTrigger>
          <app_tabs_1.AppTabsTrigger value="attendance">Assiduité</app_tabs_1.AppTabsTrigger>
        </app_tabs_1.AppTabsList>

        
        <app_tabs_1.AppTabsContent value="overview" className="mt-6 space-y-6">
          <tabs_overview_1.TabsOverview student={student}/>
        </app_tabs_1.AppTabsContent>

        
        <app_tabs_1.AppTabsContent value="results" className="mt-6">
          <card_1.Card>
            <card_1.CardContent className="p-8 text-center text-muted-foreground">
              <lucide_react_1.GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-20"/>
              <p>Le module de résultats sera disponible bientôt.</p>
            </card_1.CardContent>
          </card_1.Card>
        </app_tabs_1.AppTabsContent>

        
        <app_tabs_1.AppTabsContent value="finance" className="mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Historique des Paiements</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (<div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 text-green-700 rounded-full">
                        <lucide_react_1.CreditCard className="h-5 w-5"/>
                      </div>
                      <div>
                        <p className="font-medium">
                          Frais de Scolarité - Tranche {i}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Payé le 12 Oct 2023
                        </p>
                      </div>
                    </div>
                    <div className="font-bold">50.000 FCFA</div>
                  </div>))}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </app_tabs_1.AppTabsContent>

        
        <app_tabs_1.AppTabsContent value="attendance" className="mt-6">
          <card_1.Card>
            <card_1.CardContent className="p-8 text-center text-muted-foreground">
              <lucide_react_1.CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20"/>
              <p>Le calendrier d'assiduité sera disponible bientôt.</p>
            </card_1.CardContent>
          </card_1.Card>
        </app_tabs_1.AppTabsContent>
      </app_tabs_1.AppTabs>

      <update_student_details_1.UpdateStudentDetails open={openSheet} onOpenChange={setOpenSheet} studentData={data?.student}/>
      <dialog_1.Dialog open={openingDialog} onOpenChange={setOpeningDialog}>
        <dialog_1.DialogContent className="">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle className="sr-only">
              Deposer-glisser une image
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="w-full">
            <file_upload_1.FileUpload title="Télécharger une image" description="Glissez-déposez ou cliquez pour sélectionner" isImage={true} url={profile?.photo ?? undefined} isLoading={isLoading} onChange={handlePhotoUpload}/>
          </div>
          <dialog_1.DialogFooter>{<button_1.Button>Modifier</button_1.Button>}</dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
function InfoItem({ label, value, icon: Icon, }) {
    return (<div className="flex items-start gap-3">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground"/>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map