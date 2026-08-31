'use client';

import { useGetClassDetailsQuery } from '@stackschool/ui';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Edit, Trash2, User, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TeacherView } from '@/components/lists/class/teacher-view';
import { ClassStudentList } from '@/components/lists/class/class-student-list';
import { TodaySubjects } from '@/components/lists/class/today-subjects';
import ClassScheduleGrid from '@/components/lists/class/schedule/schedule-grid';
import {
  AppTabs,
  AppTabsContent,
  AppTabsList,
  AppTabsTrigger,
} from '@/components/app-tabs';
import { ClassSubjectsView } from '@/components/lists/class-subject/subject-view/subjects-view';

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;

  const { data, isLoading, error } = useGetClassDetailsQuery(
    { id: classId },
    { enabled: !!classId },
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !data?.class) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Classe introuvable.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const classData = data.class;
  const supervisor = classData.supervisor;
  const supervisorProfile = supervisor?.user?.profile;
  const femaleCount = classData._count?.students?.female || 0;
  const maleCount = classData._count?.students?.male || 0;
  const totalCount = femaleCount + maleCount;

  return (
    <div className="flex-1 p-2 md:p-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className=" flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                {classData.name}
              </h1>
              <Badge variant="outline" className="text-xs md:text-sm">
                {classData.level}
              </Badge>
              {classData.section && (
                <Badge variant="secondary" className="text-xs md:text-sm">
                  Section {classData.section}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs md:text-sm">
                2025 - 2026
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Users className="h-4 w-4" />
              <span>
                {totalCount}
                élèves
              </span>
              <span>•</span>
              <BookOpen className="h-4 w-4" />
              <span>{classData?._count?.subjects} matières</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
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
      <AppTabs defaultValue="overview">
        <AppTabsList>
          <AppTabsTrigger value="overview">Aperçu</AppTabsTrigger>
          <AppTabsTrigger value="students">
            Élèves ({totalCount})
          </AppTabsTrigger>
          <AppTabsTrigger value="subjects">
            Matières ({classData?._count?.subjects})
          </AppTabsTrigger>
          <AppTabsTrigger value="teachers">Équipe Pédagogique</AppTabsTrigger>
          <AppTabsTrigger value="schedule">Emploi du temps</AppTabsTrigger>
        </AppTabsList>

        {/* CONTENU APERÇU */}
        <AppTabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne Gauche : Superviseur & Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Professeur Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {supervisor ? (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={supervisorProfile?.photo || undefined}
                        />
                        <AvatarFallback>
                          {supervisorProfile?.firstname?.[0]}
                          {supervisorProfile?.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
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
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Aucun professeur principal assigné.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    Effectif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCount}</div>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="font-medium">{maleCount}</span> Garçons
                    </div>
                    <div className="flex items-center gap-1 text-pink-600">
                      <span className="font-medium">{femaleCount}</span> Filles
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne Droite : Emploi du temps simplifié (Aujourd'hui) */}
            <TodaySubjects classId={classId} />
          </div>
        </AppTabsContent>

        {/* CONTENU ÉLÈVES */}
        <AppTabsContent value="students" className="mt-6">
          <ClassStudentList classId={classId} />
        </AppTabsContent>
        {/* CONTENU MATIÈRE */}
        <AppTabsContent value="subjects">
          <ClassSubjectsView classId={classId} />
        </AppTabsContent>
        {/* CONTENU PROFS */}
        <AppTabsContent value="teachers" className="mt-6">
          <TeacherView classId={classId} />
        </AppTabsContent>

        {/* CONTENU EMPLOI DU TEMPS */}
        <AppTabsContent value="schedule" className="mt-6">
          <ClassScheduleGrid classId={classId} />
        </AppTabsContent>
      </AppTabs>
    </div>
  );
}
