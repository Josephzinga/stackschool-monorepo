import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ParentForm } from '@/components/lists/parent/form/parent-form';
import { ParentData } from '../table/column';
import { RelationTypeEnum, UpdateParentSchema } from '@stackschool/contracts';

export interface ParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: ParentData | null;
  onSuccess?: () => void;
  onConfirm?: () => void;
}
export function ParentDialog({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
  onConfirm,
}: ParentDialogProps) {
  let initialValues: (UpdateParentSchema & { userId?: string }) | undefined =
    undefined;
  if (defaultValues) {
    initialValues = {
      id: defaultValues.id,
      email: defaultValues.contact?.email,
      userId: defaultValues.userId,
      phoneNumber: defaultValues.contact?.phoneNumber,
      firstName: defaultValues.profile.firstName,
      lastName: defaultValues.profile.lastName,
      profession: defaultValues.profession,
      address: defaultValues.address,
      gender: defaultValues.gender,
      children: defaultValues?.students?.map((st) => ({
        ...st,
        studentId: st.id,
        parentId: defaultValues.id,
        relationType: st.relationType as RelationTypeEnum,
        class: {
          name: st.classe.name,
        },
      })),
    };
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120 font-poppins max-h-[80vh] md:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crée un parent</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ParentForm
          initialValues={initialValues}
          onConfirm={onConfirm}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
