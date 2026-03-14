import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassSubject } from '@stackschool/ui';
import { router } from 'next/client';
import { Briefcase } from 'lucide-react';

function ClassesSection({
  classSubject,
}: {
  classSubject?: (ClassSubject | null | undefined)[] | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classSubject?.map((cls) => {
        const studentCount =
          (cls?.classe?._count?.students?.female || 0) +
          (cls?.classe?._count?.students?.male || 0);

        return (
          <Card
            key={cls?.id}
            className="hover:border-primary/50 font-inter transition-colors cursor-pointer group"
            onClick={() => router.push(`/list/classes/${cls?.id}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {cls?.classe?.name}
              </CardTitle>
              <p className="text-sm font-medium text-muted-foreground">
                {cls?.subject?.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{studentCount} élèves</div>
            </CardContent>
          </Card>
        );
      })}
      {(!classSubject || classSubject.length === 0) && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Briefcase className="h-8 w-8 mb-2 opacity-20" />
          <p>Aucune classe assignée.</p>
        </div>
      )}
    </div>
  );
}

export default ClassesSection;
