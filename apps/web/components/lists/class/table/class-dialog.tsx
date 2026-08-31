import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CreateClassForm from '@/components/lists/class/create-class-form';
import { ClassData } from '@/components/lists/class/table/columns';

export default function ClassDialog({
  open,
  onOpenChange,
  initialValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ClassData;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau classe</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter une classe à l'école.
          </DialogDescription>
        </DialogHeader>

        <CreateClassForm
          editDefaultValues={initialValues}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
