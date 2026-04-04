import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MoreHorizontal } from 'lucide-react';
import { useGetTeachersTeamQuery } from '@stackschool/ui';
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
import { CreateClassSubjectForm } from '@/components/school/create-classSubject-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function TeacherView({ classId }: { classId?: string }) {
  const [open, setOpen] = useState(false);
  const [defautValues, setDefautValues] = useState();
  const { data } = useGetTeachersTeamQuery({
    id: classId!,
  });
  const classSubjects = data?.class?.group?.classSubjects;
  return (
    <Card className="gap-4 p-2">
      <CardHeader>
        <div className="flex w-full justify-between items-center">
          <CardTitle>Équipe Pédagogique</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  variant="ghost"
                  size="icon"
                >
                  <MoreHorizontal />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">ajouter un professeur.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classSubjects?.map((classSubject) => (
            <Card
              key={classSubject?.id}
              className="border gap-1 py-2 px-2 shadow-sm hover:border hover:border-primary"
            >
              <CardContent className="p-4 flex items-center gap-4 ">
                <div className="flex flex-col gap-4">
                  {classSubject?.teacher ? (
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            classSubject?.teacher?.user?.profile?.photo ??
                            undefined
                          }
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {classSubject?.teacher?.user?.profile?.firstname?.[0]}
                          {classSubject?.teacher?.user?.profile?.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/list/teachers/${classSubject?.teacher?.id}`}
                        className="font-inter font-medium hover:underline hover:underline-offset-2"
                      >
                        {classSubject?.teacher?.user?.profile?.firstname}{' '}
                        {classSubject?.teacher?.user?.profile?.lastname}
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-desctructive italic">
                      Professeur non assigné
                    </p>
                  )}
                  <div className="flex gap-2 items-center">
                    <div className="p-2 w-8 h-8 flex justify-center items-center bg-primary/10 text-primary rounded-full">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <p className="font-medium font-jost text-muted-foreground">
                      {classSubject?.subject?.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!classSubjects || classSubjects?.length === 0) && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Aucune matière configurée.
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter dans l'équipe</DialogTitle>
          </DialogHeader>
          <CreateClassSubjectForm classId={classId} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
