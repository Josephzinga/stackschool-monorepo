"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleDialog = void 0;
const dialog_1 = require("@/components/ui/dialog");
const lesson_form_1 = require("@/components/school/lesson/lesson-form");
const ScheduleDialog = ({ open, onOpenChange, initialData, classId, }) => {
    return (<div>
      <dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Schedule</dialog_1.DialogTitle>
            <dialog_1.DialogDescription></dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <lesson_form_1.LessonForm initialData={initialData} onSuccess={() => console.log('success')} onClose={() => console.log('closed')} resourceId={classId} isClassOnly={true}/>
          )
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
};
exports.ScheduleDialog = ScheduleDialog;
//# sourceMappingURL=schedule-dialog.js.map