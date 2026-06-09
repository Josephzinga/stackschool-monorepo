"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomFormDialog = RoomFormDialog;
const dialog_1 = require("@/components/ui/dialog");
const room_form_1 = require("@/components/school/room/room-form");
function RoomFormDialog({ open = false, onOpenChange, }) {
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
      <dialog_1.DialogContent>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Crée une salle</dialog_1.DialogTitle>
        </dialog_1.DialogHeader>
        <room_form_1.RoomForm onSucces={() => onOpenChange(false)}/>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
//# sourceMappingURL=room-form-dialog.js.map