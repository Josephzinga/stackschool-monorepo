import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoomForm } from '@/components/lists/room/room-form';

export function RoomFormDialog({
  open = false,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crée une salle</DialogTitle>
        </DialogHeader>
        <RoomForm onSucces={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
