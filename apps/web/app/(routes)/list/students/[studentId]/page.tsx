'use client';

import { useGetStudentDetailsQuery, useUserStore } from '@stackschool/ui';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Edit,
  GraduationCap,
  Loader,
  Printer,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AppTabs,
  AppTabsContent,
  AppTabsList,
  AppTabsTrigger,
} from '@/components/app-tabs';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from 'sonner';
import { api, parseAxiosError } from '@stackschool/shared';
import { UpdateStudentDetails } from '@/components/lists/student/update-student-details';
import { TabsOverview } from '@/components/lists/student/tabs-overview';

export default function StudentDetailsPage() {
  const [openSheet, setOpenSheet] = useState(false);
  const [openingDialog, setOpeningDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const { currentSchool } = useUserStore();

  const { data, isPending, error } = useGetStudentDetailsQuery(
    { id: studentId },
    { enabled: !!studentId && !!currentSchool?.id },
  );

  if (isPending) return <Loader />;

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
  const profile = student?.user?.profile;
  const handlePhotoUpload = async (files: File[]) => {
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("L'image doit faire moins de 5MB");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const res = await api.post('/api/upload/profile-picture', formData);

      const data = res.data;

      if (data.ok) {
        toast.success(
          `${res.data.message}` || 'Photo de profil téléchargée avec succès !',
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      const { message, status, data } = parseAxiosError(error);
      toast.error(message || 'Erreur lors du téléchargement de la photo');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-1 p-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center xl:mt-4 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar
              onClick={() => setOpeningDialog(true)}
              className="h-16 w-16 md:h-20 md:w-20 border-2 border-background shadow-sm"
            >
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
              <div className="flex gap-2 text-sm opacity-90 font-sans">
                Compte utilisateur:
                <Badge
                  variant={student?.user?.isActive ? 'default' : 'destructive'}
                >
                  {student?.user?.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button
            onClick={() => setOpenSheet(true)}
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
          >
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
      <AppTabs defaultValue="overview" className="w-full">
        <AppTabsList className="w-full bg-accent/70 rounded-sm justify-start border-b p-0 h-auto overflow-x-auto">
          <AppTabsTrigger value="overview">Aperçu</AppTabsTrigger>
          <AppTabsTrigger value="results">Résultats</AppTabsTrigger>
          <AppTabsTrigger value="finance">Finances</AppTabsTrigger>
          <AppTabsTrigger value="attendance">Assiduité</AppTabsTrigger>
        </AppTabsList>

        {/* CONTENU APERÇU */}
        <AppTabsContent value="overview" className="mt-6 space-y-6">
          <TabsOverview student={student} />
        </AppTabsContent>

        {/* CONTENU RÉSULTATS (Placeholder) */}
        <AppTabsContent value="results" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Le module de résultats sera disponible bientôt.</p>
            </CardContent>
          </Card>
        </AppTabsContent>

        {/* CONTENU FINANCES (Placeholder) */}
        <AppTabsContent value="finance" className="mt-6">
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
        </AppTabsContent>

        {/* CONTENU ASSIDUITÉ (Placeholder) */}
        <AppTabsContent value="attendance" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Le calendrier d'assiduité sera disponible bientôt.</p>
            </CardContent>
          </Card>
        </AppTabsContent>
      </AppTabs>

      <UpdateStudentDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        studentData={data?.student}
      />
      <Dialog open={openingDialog} onOpenChange={setOpeningDialog}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="sr-only">
              Deposer-glisser une image
            </DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <FileUpload
              title="Télécharger une image"
              description="Glissez-déposez ou cliquez pour sélectionner"
              isImage={true}
              url={profile?.photo ?? undefined}
              isLoading={isLoading}
              onChange={handlePhotoUpload}
            />
          </div>
          <DialogFooter>{<Button>Modifier</Button>}</DialogFooter>
        </DialogContent>
      </Dialog>
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
