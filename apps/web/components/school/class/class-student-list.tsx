import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Classe } from '@stackschool/ui';
import { router } from 'next/client';

export function ClassStudentList({ classData }: { classData?: Classe }) {
  return (
    <div className="space-y-2">
      {classData?.students?.map((student) => (
        <div
          key={student?.id}
          className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={student?.profile?.photo || undefined} />
              <AvatarFallback className="text-xs">
                {student?.profile?.firstname?.[0]}
                {student?.profile?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {student?.profile?.firstname} {student?.profile?.lastname}
              </p>
              <p className="text-xs text-muted-foreground">
                {student?.matricule}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/list/students/${student?.id}`)}
          >
            Voir
          </Button>
        </div>
      ))}
      {(!classData?.students || classData.students.length === 0) && (
        <p className="text-center text-muted-foreground py-8">
          Aucun élève dans cette classe.
        </p>
      )}
    </div>
  );
}
