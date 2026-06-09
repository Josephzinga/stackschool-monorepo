'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LessonAlertDialog;
const react_1 = __importDefault(require("react"));
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const shared_1 = require("@stackschool/shared");
const lesson_store_1 = require("@/store/lesson-store");
const useLessonMutations_1 = require("@/components/school/lesson/hooks/useLessonMutations");
function LessonAlertDialog({ onCancelUpdate, }) {
    const { alertOpen, setAlertOpen, targetEventDrop } = (0, lesson_store_1.useLessonStore)();
    const { handleUpdate } = (0, useLessonMutations_1.useLessonMutations)();
    return (<alert_dialog_1.AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <alert_dialog_1.AlertDialogContent className="max-w-90! max-h-100! shadow-2xl!">
        <alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogTitle>Confirmer la modification</alert_dialog_1.AlertDialogTitle>
          <alert_dialog_1.AlertDialogDescription>
            Êtes-vous sûr de vouloir modifier cette leçon ?
          </alert_dialog_1.AlertDialogDescription>
        </alert_dialog_1.AlertDialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm p-4 bg-muted rounded-lg">
          <div className="space-y-2  text-xs  md:text-sm">
            <p className="font-medium text-muted-foreground">Avant :</p>
            <div className="space-y-1">
              <p>
                Début:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.originalStart}
                </span>
              </p>
              <p>
                Fin:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.originalEnd}
                </span>
              </p>
              <p>
                Jour:{' '}
                <span className="text-foreground">
                  {shared_1.dayConstant.find((d) => d.value === targetEventDrop?.originalDay)?.label}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs  md:text-sm">
            <p className="font-medium text-primary">Après :</p>
            <div className="space-y-1">
              <p>
                Début:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.start}
                </span>
              </p>
              <p>
                Fin:{' '}
                <span className="text-foreground font-mono">
                  {targetEventDrop?.end}
                </span>
              </p>
              <p>
                Jour:{' '}
                <span className="text-foreground">
                  {shared_1.dayConstant.find((d) => d.value === targetEventDrop?.day)
            ?.label}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ La modification affectera l'emploi du temps pour toutes les
            ressources concernées.
          </p>
        </div>

        <alert_dialog_1.AlertDialogFooter>
          <alert_dialog_1.AlertDialogCancel className=" h-8!" onClick={onCancelUpdate}>
            Annuler
          </alert_dialog_1.AlertDialogCancel>
          <alert_dialog_1.AlertDialogAction className="h-8" onClick={handleUpdate}>
            Confirmer
          </alert_dialog_1.AlertDialogAction>
        </alert_dialog_1.AlertDialogFooter>
      </alert_dialog_1.AlertDialogContent>
    </alert_dialog_1.AlertDialog>);
}
//# sourceMappingURL=lesson-alert-dialog.js.map