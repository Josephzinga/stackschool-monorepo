import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Classe } from '@stackschool/ui';
import { router } from 'next/client';
import { Briefcase } from 'lucide-react';

function ClassesSection({
  classes,
}: {
  classes?: (Classe | undefined | null)[] | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes?.map((cls) => (
        <Card
          key={cls?.id}
          className="hover:border-primary/50 transition-colors cursor-pointer group"
          onClick={() => router.push(`/list/classes/${cls?.id}`)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base group-hover:text-primary transition-colors">
              {cls?.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{cls?.level}</p>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {cls?._count?.students || 0} élèves
            </div>
          </CardContent>
        </Card>
      ))}
      {(!classes || classes.length === 0) && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Briefcase className="h-8 w-8 mb-2 opacity-20" />
          <p>Aucune classe assignée.</p>
        </div>
      )}
    </div>
  );
}

export default ClassesSection;
