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
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  Trash2,
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
import { cn } from '@/lib/utils';
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
import TimeGrid from '@/components/school/teacher/schedule-grid';
import ClassesSection from '@/components/school/teacher/classes-section';
import { ChartRadialPerformance } from '@/components/school/teacher/chart-performance';

const shortHands = [
  { value: 'classes', label: 'Classes', href: '/list/classes' },
  { value: 'lessons', label: 'Leçons', href: '/list/lessons' },
  { value: 'subject', label: 'Matières', href: '/list/subjects' },
  { value: 'students', label: 'Élèves', href: '/list/students' },
];

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.teacherId as string;
  const { currentSchool } = useUserStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { data, isLoading, error } = useGetTeacherDetailsQuery(
    { id: teacherId },
    { enabled: !!teacherId },
  );

  const { mutateAsync, isPending: isDeleting } = useDeleteTeachersMutation();

  const handleDelete = async () => {
    if (!currentSchool?.id) return;

    const promise = mutateAsync({
      teacherIds: [teacherId],
      schoolId: currentSchool.id,
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

  const handleShortcut = (href: string) => {
    // Redirection avec filtre (ex: /list/classes?teacherId=123)
    router.push(`${href}?teacherId=${teacherId}`);
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
  const profile = teacher.user?.profile;

  return (
    <div className="flex-1 sm:p-4 flex flex-col xl:flex-row gap-4 ">
      {/* GAUCHE (Scrollable) */}

      <Card className="w-full h-full py-2 px-3">
        <CardHeader className=" px-2 flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
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
                  src={profile?.photo || undefined}
                />
                <AvatarFallback className="text-3xl bg-primary/10 font-jost text-primary">
                  {profile?.firstname?.[0]}
                  {profile?.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full space-y-2 md:space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {profile?.firstname} {profile?.lastname}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  {teacher.specialization || 'Enseignant'}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-2 w-full pr-1">
                  <Item icon={Phone}>
                    {teacher.user?.phoneNumber || 'Non renseigné'}
                  </Item>
                  <Item icon={Mail}>
                    {teacher.user?.email || 'Non renseigné'}
                  </Item>
                  <Item icon={MapPin}>
                    {profile?.address || 'Adresse non renseignée'}
                  </Item>
                  <Item icon={ActivityIcon}>
                    <Badge
                      variant={teacher.isActive ? 'default' : 'secondary'}
                      className="h-5 text-xs px-2"
                    >
                      {teacher.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </Item>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="flex-1">
          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Aperçu
              </TabsTrigger>
              <TabsTrigger
                value="classes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Classes ({teacher.classes?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Emploi du temps
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="overview"
              className="mt-6 h-full space-y-6 px-2"
            >
              <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </TabsContent>

            <TabsContent value="classes" className="mt-6 min-h-full px-2">
              <ClassesSection classes={teacher?.classes} />
            </TabsContent>

            <TabsContent value="schedule" className="mt-6 px-2 overflow-y-auto">
              <TimeGrid lessons={teacher?.lessons} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* DROITE (Sticky) */}
      <div className="w-full h-full xl:w-2/7 flex flex-col gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-jost">
              Raccourcis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {shortHands.map((item) => (
                <Button
                  key={item.value}
                  variant="outline"
                  className="h-auto py-3 flex flex-col gap-1 hover:border-primary hover:text-primary transition-all bg-card text-foreground border-2 first:border-none last:border-none shadow-sm"
                  onClick={() => handleShortcut(item.href)}
                >
                  <span className="font-medium font-poppins">{item.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-jost">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartRadialPerformance />
          </CardContent>
        </Card>
      </div>
      {/* Dialog de suppression */}

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
    </div>
  );
}

function Item({
  children,
  icon: Icon,
  className,
  iconClassName,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}) {
  if (!children) return null;
  return (
    <div className="flex items-center gap-1 xl:gap-3">
      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
        <Icon className={cn('h-4 w-4 text-slate-600', iconClassName)} />
      </div>
      <p
        className={cn(
          'text-sm text-wrap font-medium text-slate-700 dark:text-slate-200',
          className,
        )}
      >
        {children}
      </p>
    </div>
  );
}
