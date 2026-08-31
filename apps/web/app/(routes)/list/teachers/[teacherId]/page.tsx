'use client';

import {
  useDeleteTeachersMutation,
  useGetTeacherDetailsQuery,
  useUserStore,
} from '@stackschool/ui';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  ActivityIcon,
  ArrowLeft,
  Briefcase,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { InfoItem } from '@/components/lists/info-item';
import {
  AppTabs,
  AppTabsContent,
  AppTabsList,
  AppTabsTrigger,
} from '@/components/app-tabs';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.teacherId as string;
  const { currentSchool } = useUserStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const { data, isLoading, error } = useGetTeacherDetailsQuery(
    { id: teacherId },
    { enabled: !!teacherId },
  );

  const { mutateAsync, isPending: isDeleting } = useDeleteTeachersMutation();

  const handleDelete = async () => {
    if (!currentSchool?.id) return;

    const promise = mutateAsync({
      teacherIds: [teacherId],
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: 'Professeur supprimé',
      error: 'Erreur lors de la suppression',
    });

    try {
      await promise;
      router.push('/list/teachers');
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !data?.teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Enseignant introuvable.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const teacher = data.teacher;
  const profile = teacher?.schoolProfile;

  return (
    <div className="flex-1 sm:p-4 flex justify-center gap-4 ">
      {/* GAUCHE (Scrollable) */}

      <div className="w-full h-full py-2 space-y-4 max-w-350 px-3">
        <CardHeader className=" px-2 flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => setOpenSheet(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
          <div className="flex items-center py-4 md:p-4 rounded-md bg-accent h-full w-full gap-4 md:gap-6">
            <div className="h-full flex items-center max-w-50 max-h-50 justify-center">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-sm">
                <AvatarImage
                  className="object-cover"
                  src={profile?.avatarUrl || undefined}
                />
                <AvatarFallback className="text-3xl bg-primary/10 font-jost text-primary">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full space-y-2 md:space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {teacher.specialization || 'Enseignant'}
              </p>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-2 w-full pr-1">
                  <InfoItem icon={Phone}>
                    {teacher?.schoolUser?.user?.phoneNumber || 'Non renseigné'}
                  </InfoItem>
                  <InfoItem icon={Mail}>
                    {teacher.schoolUser?.user?.email || 'Non renseigné'}
                  </InfoItem>
                  <InfoItem icon={MapPin}>
                    {profile?.address || 'Adresse non renseignée'}
                  </InfoItem>
                  <InfoItem icon={ActivityIcon}>
                    <Badge
                      variant={teacher.isActive ? 'default' : 'secondary'}
                      className="h-5 text-xs px-2"
                    >
                      {teacher.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </InfoItem>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="flex-1">
          <AppTabs defaultValue="overview" className="">
            <AppTabsList className="rounded-lg mb-2">
              <AppTabsTrigger value="overview">Aperçu</AppTabsTrigger>
              <AppTabsTrigger value="classes">
                <div onClick={() => router.push('#classes')}>
                  Classes ({teacher?.classesCount || 0})
                </div>
              </AppTabsTrigger>
              <AppTabsTrigger value="schedule">Emploi du temps</AppTabsTrigger>
            </AppTabsList>
            <AppTabsContent value="overview">
              <Card className="">
                <CardHeader className="flex justify-end pt-0">
                  <Button variant="outline" size={'icon'}>
                    <MoreHorizontal />
                  </Button>
                </CardHeader>
                <CardContent className="grid h-full grid-cols-1 md:grid-cols-2 px-2 md:px-4  gap-6">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Informations Professionnelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
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
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            Département
                          </span>
                          <span className="font-medium">
                            {teacher.department || '-'}
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
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Biographie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {teacher?.bio}
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </AppTabsContent>

            <AppTabsContent id="classes" value="classes">
              {/*   <ClassesSection teacherId={teacher?.id} /> */}
            </AppTabsContent>

            <AppTabsContent value="schedule">
              {/*   <TeacherScheduleGrid id={teacherId} /> */}
            </AppTabsContent>
          </AppTabs>
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce professeur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées seront
              supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right">
          <SheetHeader></SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
