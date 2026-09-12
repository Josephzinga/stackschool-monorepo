import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StaffForm } from '@/components/lists/staff/form/staff-form';
import { StaffData } from '@/components/lists/staff/table/columns';
import { UpdateStaffSchema } from '@stackschool/contracts';

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: StaffData;
}

export const StaffDialog = ({
  open,
  onOpenChange,
  defaultValues,
}: StaffFormProps) => {
  let initialValues: UpdateStaffSchema | undefined = undefined;
  if (defaultValues) {
    initialValues = {
      ...defaultValues,
      firstName: defaultValues.profile.firstName,
      lastName: defaultValues.profile.lastName,
      email: defaultValues.contact.email,
      phoneNumber: defaultValues.contact.phoneNumber,
    };
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120 font-poppins max-h-[80vh] md:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crée un personnel</DialogTitle>
        </DialogHeader>
        <StaffForm
          initialValues={initialValues}
          onConfirm={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
