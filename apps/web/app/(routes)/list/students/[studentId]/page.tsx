'use client';

import { useGetStudentDetailsQuery, useUserStore } from '@stackschool/ui';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Edit,
  FileText,
  GraduationCap,
  MapPin,
  Printer,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/radix/tabs';
import { Separator } from '@/components/ui/separator';

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const { currentSchool } = useUserStore();

  const { data, isLoading, error } = useGetStudentDetailsQuery(
    { id: studentId, schoolId: currentSchool?.id! },
    { enabled: !!studentId && !!currentSchool?.id },
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !data?.student) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Élève introuvable.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const student = data.student;
  const profile = student.profile;

  return (
    <div className="flex-1 p-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center xl:mt-4 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-background shadow-sm">
              <AvatarImage src={profile?.photo || undefined} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                {profile?.firstname?.[0]}
                {profile?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile?.firstname} {profile?.lastname}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <Badge variant="outline" className="font-mono">
                  {student.matricule}
                </Badge>
                <span>•</span>
                <span className="font-medium text-foreground">
                  {student.schoolClass?.name || 'Sans classe'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" size="icon" className="shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full bg-accent/70 rounded-sm justify-start border-b p-0 h-auto overflow-x-auto">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Aperçu
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Résultats
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Finances
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Assiduité
          </TabsTrigger>
        </TabsList>

        {/* CONTENU APERÇU */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne Gauche : Identité & Famille */}
            <div className="md:col-span-2 space-y-6">
              {/* Identité */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <InfoItem
                    label="Date de naissance"
                    value={
                      student.birthDate
                        ? new Date(student.birthDate).toLocaleDateString()
                        : '-'
                    }
                    icon={CalendarDays}
                  />
                  <InfoItem
                    label="Lieu de naissance"
                    value={student.birthPlace || '-'}
                    icon={MapPin}
                  />
                  <InfoItem
                    label="Nationalité"
                    value={student.nationality || '-'}
                    icon={FileText}
                  />
                  <InfoItem
                    label="Sexe"
                    value={profile?.gender === 'MALE' ? 'Masculin' : 'Féminin'}
                    icon={User}
                  />
                  <InfoItem
                    label="Année d'inscription"
                    value={student.enrollmentYear}
                    icon={CalendarDays}
                  />
                </CardContent>
              </Card>

              {/* Famille */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Informations Familiales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Père
                      </p>
                      <p className="font-medium">
                        {student.fatherName || 'Non renseigné'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Mère
                      </p>
                      <p className="font-medium">
                        {student.motherName || 'Non renseigné'}
                      </p>
                    </div>
                  </div>

                  {/* Parents liés (Compte utilisateur) - Placeholder */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Comptes Parents Associés
                    </h4>
                    <div className="text-sm text-muted-foreground italic">
                      Aucun compte parent associé pour le moment.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne Droite : Stats Rapides */}
            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    État Financier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">À jour</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aucun paiement en retard
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    Moyenne Générale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">14.5/20</div>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    +0.5 vs Trimestre 1
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    Assiduité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 absences justifiées
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* CONTENU RÉSULTATS (Placeholder) */}
        <TabsContent value="results" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Le module de résultats sera disponible bientôt.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENU FINANCES (Placeholder) */}
        <TabsContent value="finance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 text-green-700 rounded-full">
                        <CreditCard className="h-5 w-5" />
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENU ASSIDUITÉ (Placeholder) */}
        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Le calendrier d'assiduité sera disponible bientôt.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: any;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}
