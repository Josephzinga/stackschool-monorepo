import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MoreHorizontal } from 'lucide-react';
import { useGetTeacherAssignmentQuery, useQueryClient } from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TeacherAssignmentForm,
  TeacherAssignmentFormProps,
} from '@/components/school/teacher/form/assignment-form';

function ClassesSection({ teacherId }: { teacherId?: string }) {
  const [open, setOpen] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState<
    TeacherAssignmentFormProps['initialValues']
  >({ teacherId });
  const queryClient = useQueryClient();
  const { data, isPending, error } = useGetTeacherAssignmentQuery(
    {
      id: teacherId!,
    },
    {
      enabled: !!teacherId,
    },
  );
  const map = new Map<
    string,
    { id: string; name: string; subjects: Array<{ name: string; id: string }> }
  >();
  data?.getAssignments?.forEach((ass) => {
    const classe = ass.classSubjects?.group.classes[0];
    if (classe?.id) {
      if (map.has(classe.id)) {
        const classes = map.get(classe.id);
        if (!classes) return;
        map.set(classe?.id, {
          ...classes,
          subjects: [
            ...classes.subjects,
            {
              name: ass?.classSubjects?.subject.name ?? '',
              id: ass.classSubjects?.subject.id ?? '',
            },
          ],
        });
      } else {
        map.set(classe?.id, {
          id: classe?.id,
          name: classe.name ?? '',
          subjects: [
            {
              name: ass.classSubjects?.subject.name ?? '',
              id: ass?.classSubjects?.subject.id ?? '',
            },
          ],
        });
      }
    }
  });
  const classes = Array.from(map.values());

  const handleSucces = async () => {
    await queryClient.invalidateQueries({ queryKey: ['GetTeacherAssignment'] });
    setOpen(!open);
  };
  const handleEdit = (classId: string, subjectIds: string[]) => {
    setInitialValues({ teacherId, classId, subjectIds: [...subjectIds] });
    setOpen(true);
  };

  const handleAdd = () => {
    setInitialValues({ teacherId });
    setOpen(true);
  };
  return (
    <Card>
      <CardHeader className="flex w-full justify-end">
        <Button onClick={handleAdd} variant="outline" className="flex gap-2">
          <MoreHorizontal className="h-10 w-10" />
          ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((cls) => {
            return (
              <Card
                key={cls.id}
                className="hover:border-primary/50 font-inter transition-colors cursor-pointer group"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {cls.name}
                    </CardTitle>
                    <Button
                      onClick={() =>
                        handleEdit(
                          cls.id,
                          cls.subjects.map((sub) => sub.id),
                        )
                      }
                      size="icon-sm"
                    >
                      <MoreHorizontal />
                    </Button>
                  </div>
                  {cls.subjects.map((sub) => (
                    <p className="text-sm font-medium text-muted-foreground">
                      {sub.name}
                    </p>
                  ))}
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            );
          })}
          {(!classes || classes.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <Briefcase className="h-8 w-8 mb-2 opacity-20" />
              <p>Aucune classe assignée.</p>
            </div>
          )}
        </div>
      </CardContent>

      {open && (
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigné au classes</DialogTitle>
              <TeacherAssignmentForm
                initialValues={initialValues}
                showTeacherInput={false}
                onSuccess={handleSucces}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

export default ClassesSection;
