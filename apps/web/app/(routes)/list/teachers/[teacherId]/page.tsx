'use client';

import { useGetTeacherDetailsQuery } from '@stackschool/ui';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Briefcase,
  Edit,
  GraduationCap,
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
import { Separator } from '@/components/ui/separator';

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.teacherId as string;

  const { data, isLoading, error } = useGetTeacherDetailsQuery(
    { id: teacherId },
    { enabled: !!teacherId },
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }
  console.log('Data', data?.teacher, data);

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
    <div className="flex flex-col h-full p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
              <AvatarImage src={profile?.photo || undefined} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {profile?.firstname?.[0]}
                {profile?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {profile?.firstname} {profile?.lastname}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Badge variant="secondary" className="font-normal">
                  {teacher.specialization || 'Généraliste'}
                </Badge>
                <span>•</span>
                <span>{teacher.isActive ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="classes">
            Classes ({teacher.classes?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Infos Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{teacher.user?.email || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{teacher.user?.phoneNumber || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.address || 'Adresse non renseignée'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Infos Pro */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Informations Professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Diplôme
                    </span>
                    <span>{teacher.diploma || '-'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Département
                    </span>
                    <span>{teacher.departement || '-'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 flex items-center justify-center font-bold text-muted-foreground text-xs">
                    Hr
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Volume Horaire
                    </span>
                    <span>{teacher.weeklyHours}h / semaine</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacher.classes?.map((cls) => (
              <Card
                key={cls?.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-base">{cls?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cls?.level}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">{cls?._count?.students} élèves</div>
                </CardContent>
              </Card>
            ))}
            {(!teacher.classes || teacher.classes.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                Aucune classe assignée.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {/* Placeholder pour le calendrier */}
              <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                Composant Calendrier à intégrer ici
                <br />
                (Utilise teacher.lessons)
              </div>

              {/* Liste simple des cours pour debug */}
              <div className="mt-8 space-y-2">
                {teacher.lessons?.map((lesson) => (
                  <div
                    key={lesson?.id}
                    className="flex justify-between p-2 border rounded bg-slate-50"
                  >
                    <span className="font-medium">{lesson?.day}</span>
                    <span>
                      {new Date(lesson?.startTime!).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(lesson?.endTime!).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>
                      {lesson?.subject?.name} ({lesson?.class?.name})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
