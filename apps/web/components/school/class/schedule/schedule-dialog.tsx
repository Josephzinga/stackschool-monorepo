import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InitialLessonData,
  LessonForm,
} from '@/components/school/lesson/lesson-form';

export const ScheduleDialog = ({
  open,
  onOpenChange,
  initialData,
  classId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: InitialLessonData;
  classId?: string;
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <LessonForm
            initialData={initialData}
            onSuccess={() => console.log('success')}
            onClose={() => console.log('closed')}
            resourceId={classId}
            isClassOnly={true}
          />
          )
        </DialogContent>
      </Dialog>
    </div>
  );
};
