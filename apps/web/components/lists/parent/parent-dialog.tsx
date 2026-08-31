import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateParentForm } from '@/components/lists/parent/form/create-parent-form';

export function ParentDialog({
  open,
  onOpenChange,
  initialValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: any;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:w-250!">
        <DialogHeader>
          <DialogTitle>Crée un parent</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CreateParentForm />
      </DialogContent>
    </Dialog>
  );
}
