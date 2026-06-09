'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSubjectsView = ClassSubjectsView;
const columns_1 = require("./columns");
const React = __importStar(require("react"));
const react_1 = require("react");
const ui_1 = require("@stackschool/ui");
const data_table_1 = require("@/components/school/class-subject/subject-view/data-table");
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const create_classSubject_form_1 = require("@/components/school/class-subject/create-classSubject-form");
function ClassSubjectsView({ classId }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const { data, isPending } = (0, ui_1.useGetClassSubjectTableQuery)({
        classId: classId,
    }, {
        enabled: !!classId,
    });
    const subjectData = data?.class?.group?.classSubjects?.map((cls) => ({
        id: cls?.id ?? '',
        coefficient: cls?.coefficient || 0,
        weeklyHours: cls?.weeklyHours || 0,
        subject: {
            id: cls?.subject.id,
            name: cls?.subject?.name ?? '',
            code: cls?.subject?.code ?? '',
        },
        teacher: cls?.assignment?.teacher || null,
    })) || [];
    return (<div className="w-full h-full mt-3 font-poppins z-10 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <h2 className="text-lg  opacity-80 font-semibold font-sans">
            Total des coefficients:{' '}
            <span className="text-white">
              {data?.class?.totalCoefficient || 0}
            </span>
          </h2>
          <h2 className="text-lg opacity-80 font-semibold font-sans">
            Total des heures:{' '}
            <span className="text-white">
              {data?.class?.totalWeeklyHours || 0}
            </span>
          </h2>
        </div>
        <button_1.Button onClick={() => setOpen(true)} className="font-semibold">
          Ajouter une matière
        </button_1.Button>
      </div>
      <data_table_1.DataTable data={subjectData} isLoading={isPending} columns={columns_1.columns}/>

      <dialog_1.Dialog modal={false} open={open} onOpenChange={setOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Ajouter une matière à cette classe</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <create_classSubject_form_1.CreateClassSubjectForm classId={classId} onSuccess={() => setOpen(false)}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
//# sourceMappingURL=subjects-view.js.map