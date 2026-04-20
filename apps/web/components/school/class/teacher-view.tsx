'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MoreHorizontal, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { useGetTeachersTeamQuery } from '@stackschool/ui';
import {
  TeacherAssignmentForm,
  TeacherAssignmentFormProps,
} from '@/components/school/teacher/form/assignment-form';

type Teacher = {
  id: string;
  firstname: string;
  lastname: string;
  photo?: string | null;
  assignments?: Array<{
    id: string;
    subject: {
      id: string;
      name: string;
    };
  }>;
};

interface TeacherViewProps {
  classId?: string;
}

export function TeacherView({ classId }: TeacherViewProps) {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] =
    useState<TeacherAssignmentFormProps['initialValues']>();

  const { data, isError, error, isPending } = useGetTeachersTeamQuery({
    classId: classId!,
  });

  const teachersTeam = data?.class?.teachingTeamMembers?.map((member) => ({
    id: member.teacher.id,
    firstname: member.teacher?.user?.profile?.firstname ?? '',
    lastname: member.teacher?.user?.profile?.lastname ?? '',
    photo: member.teacher?.user?.profile?.photo,
    assignments: member.assignments.map((assignment) => ({
      id: assignment.id,
      subject: assignment.subject,
    })),
  }));

  const handleAddSuccess = () => {
    setOpen(false);
    // Optionnel : refetch automatique via React Query (si on invalide les queries)
  };

  const handleDialog = ({
    isUpdate = false,
    teacherId,
    assignments,
  }: {
    isUpdate?: boolean;
    teacherId?: string;
    assignments?: {
      id: string;
      subjectId: string;
    }[];
  }) => {
    isUpdate
      ? setInitialValues({
          classId: classId,
          teacherId,
          assignments,
        })
      : setInitialValues({ classId });
    setOpen(true);
  };

  if (isError) {
    return (
      <Card className="p-6">
        <CardContent className="text-center text-destructive">
          <p>Erreur lors du chargement de l'équipe pédagogique.</p>
          <p className="text-sm text-muted-foreground">{error?.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Équipe Pédagogique
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleDialog({})}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Ajouter</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Ajouter un enseignant à cette classe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : teachersTeam && teachersTeam.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucun enseignant n'est encore assigné à cette classe.</p>
            <Button
              variant="link"
              onClick={() => setOpen(true)}
              className="mt-2"
            >
              Ajouter un enseignant
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {teachersTeam?.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onOptionClick={() =>
                  handleDialog({
                    isUpdate: true,
                    teacherId: teacher.id,
                    assignments: teacher.assignments.map((ass) => ({
                      id: ass.id,
                      subjectId: ass.subject.id,
                    })),
                  })
                }
              />
            ))}
          </div>
        )}
      </CardContent>
      {open && (
        <Dialog open={open} modal={false} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg rounded-xl!">
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>Ajouter un enseignant à la classe</DialogTitle>
              </DialogHeader>

              <TeacherAssignmentForm
                initialValues={initialValues}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
const TeacherCard = ({
  teacher,
  onOptionClick,
}: {
  teacher: Teacher;
  onOptionClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group pt-0 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex w-full justify-end ">
            <Button onClick={onOptionClick} variant="ghost" className="h-8">
              <MoreHorizontal />
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage src={teacher.photo ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {teacher.firstname?.[0]}
                {teacher.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href={`/list/teachers/${teacher.id}`}
                className="font-semibold text-base hover:text-primary hover:underline underline-offset-2 transition-colors"
              >
                {teacher.firstname} {teacher.lastname}
              </Link>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {teacher.assignments?.map((ass) => (
                  <Badge
                    key={ass.id}
                    variant="secondary"
                    className="text-xs gap-1 px-2 py-0.5"
                  >
                    <BookOpen className="h-3 w-3" />
                    {ass.subject.name}
                  </Badge>
                ))}
                {teacher.assignments?.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    Aucune matière assignée
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
