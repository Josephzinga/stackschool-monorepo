import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SubjectForm from '@/components/school/subject/subject-form';

export default function CreateSubjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crée une matière</DialogTitle>
        </DialogHeader>
        <SubjectForm onSuccess={() => onOpenChange(!open)} />
      </DialogContent>
    </Dialog>
  );
}
