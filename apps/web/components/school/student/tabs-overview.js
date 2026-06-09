"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsOverview = TabsOverview;
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const info_item_1 = require("../info-item");
const avatar_1 = require("@/components/ui/avatar");
const button_1 = require("@/components/ui/button");
const ui_1 = require("@stackschool/ui");
const constant_1 = require("@/constant");
const icons_react_1 = require("@tabler/icons-react");
const badge_1 = require("@/components/ui/badge");
function TabsOverview({ student, }) {
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="md:col-span-2 space-y-6">
        
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="text-lg flex items-center gap-2">
              <lucide_react_1.User className="h-5 w-5 text-primary"/>
              Informations Personnelles
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <info_item_1.InfoItem label="Date de naissance" value={student?.birthDate
            ? new Date(student?.birthDate).toLocaleDateString()
            : '-'} icon={lucide_react_1.CalendarDays}/>
            <info_item_1.InfoItem label="Lieu de naissance" value={student?.birthPlace || '-'} icon={lucide_react_1.MapPin}/>
            <info_item_1.InfoItem label="Nationalité" value={student?.nationality || '-'} icon={lucide_react_1.FileText}/>
            <info_item_1.InfoItem label="Sexe" value={student?.user?.profile?.gender === 'MALE'
            ? 'Masculin'
            : 'Féminin'} icon={lucide_react_1.User}/>
            {student?.user?.phoneNumber && (<info_item_1.InfoItem icon={lucide_react_1.Phone} label="Numéro de téléphone" value={student?.user?.phoneNumber}/>)}
            <info_item_1.InfoItem label="Address" value={student?.user?.profile?.address ?? undefined} icon={lucide_react_1.MapPinIcon}/>
            <info_item_1.InfoItem label="Mode de transport" icon={lucide_react_1.Car} value={constant_1.transportMode.find((m) => m.value === student?.transportMode)
            ?.label}/>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="text-lg flex items-center gap-2">
              <lucide_react_1.Users className="h-5 w-5 text-primary"/>
              Informations Familiales
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              {student?.parents?.map((p) => (<div key={p?.id} className="flex flex-col gap-2 border rounded-lg w-full px-3 py-2 bg-white dark:bg-black">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {ui_1.relationItems.find((r) => r.value === p?.relationType)
                ?.label}
                    </p>
                    <button_1.Button className="w-8 h-8" variant="ghost">
                      <lucide_react_1.MoreHorizontal />
                    </button_1.Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 gap-3">
                    <div className="flex gap-2 items-center">
                      <avatar_1.Avatar className="h-12 w-12">
                        <avatar_1.AvatarImage src={p?.user?.profile?.photo ?? undefined}/>
                        <avatar_1.AvatarFallback>
                          {p?.user?.profile?.firstname?.[0]}
                          {p?.user?.profile?.lastname?.[0]}
                        </avatar_1.AvatarFallback>
                      </avatar_1.Avatar>

                      <p className="font-sans text-lg font-medium">
                        {p?.user?.profile?.firstname}{' '}
                        {p?.user?.profile?.lastname}
                      </p>
                    </div>

                    <info_item_1.InfoItem label="Numéro de téléphone" value={p?.user?.phoneNumber} icon={lucide_react_1.Phone}/>
                    {p?.user?.email && (<info_item_1.InfoItem label="Addrese email" value={p?.user?.email} icon={lucide_react_1.Mail}/>)}
                    <info_item_1.InfoItem label="Profession" value={p?.profession} icon={lucide_react_1.BriefcaseBusinessIcon}/>
                    <info_item_1.InfoItem label="Addresse" value={p?.user?.profile?.address} icon={lucide_react_1.MapPin}/>
                  </div>
                </div>))}
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="text-lg flex items-center gap-2">
              <lucide_react_1.SchoolIcon className="h-5 w-5 text-primary"/>
              Information Scolaire
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <info_item_1.InfoItem label="Date d'inscription" value={student?.enrollmentDate
            ? new Date(student?.enrollmentDate).toLocaleDateString()
            : undefined} icon={lucide_react_1.CalendarDays}/>
            <info_item_1.InfoItem icon={icons_react_1.IconSchool} label="École de provenance" value={student?.previousSchool}/>
            {student?.status && (<info_item_1.InfoItem icon={lucide_react_1.ChartLineIcon} label="Statut scolaire">
                <badge_1.Badge>{constant_1.studentStatusLabel[student?.status]}</badge_1.Badge>
              </info_item_1.InfoItem>)}
            <info_item_1.InfoItem icon={lucide_react_1.FileIcon} label="Numéro de cetifica de naissance" value={student?.birthCertificateNumber}/>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      
      <div className="space-y-6">
        <card_1.Card className="bg-primary/5 border-primary/20">
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              État Financier
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-3xl font-bold text-primary">À jour</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aucun paiement en retard
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Moyenne Générale
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-3xl font-bold">14.5/20</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              +0.5 vs Trimestre 1
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Assiduité
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 absences justifiées
            </p>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
//# sourceMappingURL=tabs-overview.js.map