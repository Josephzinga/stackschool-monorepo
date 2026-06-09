"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentScanCard = StudentScanCard;
const react_1 = require("react");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const ui_1 = require("@stackschool/ui");
function StudentScanCard() {
    const [studentId, setStudentId] = (0, react_1.useState)('');
    const [selectedStatus, setSelectedStatus] = (0, react_1.useState)('PRESENT');
    const { data: studentData, refetch, isFetching, } = (0, ui_1.useGetStudentDetailsQuery)({
        id: studentId,
    });
    const { mutateAsync, isPending } = (0, ui_1.useMarkStudentAttendanceMutation)();
    const studentInfo = studentData?.student;
    const handleScan = async () => {
        if (studentId.length > 0) {
            await refetch();
        }
    };
    const handleSubmit = () => {
        console.log('onSubmit');
    };
    return (<card_1.Card className="w-full max-w-md mx-auto">
      <card_1.CardHeader>
        <card_1.CardTitle>Scanner un élève</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="flex gap-2">
          <input_1.Input placeholder="ID du badge ou nom" value={studentId} onChange={(e) => setStudentId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleScan()}/>
          <button_1.Button onClick={handleScan} disabled={isFetching}>
            {isFetching ? 'Chargement...' : 'Chercher'}
          </button_1.Button>
        </div>

        {studentInfo && (<div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              {studentInfo.user?.profile?.photo && (<img src={studentInfo.user.profile?.photo} alt="avatar" className="w-12 h-12 rounded-full"/>)}
              <div>
                <p className="font-semibold">
                  {studentInfo.user?.profile?.firstname}{' '}
                  {studentInfo.user?.profile?.lastname}
                </p>
                <p className="text-sm text-muted-foreground">
                  {studentInfo.schoolClass?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <badge_1.Badge variant={'default'}>Frais: En retard</badge_1.Badge>
              <badge_1.Badge variant="outline">Discipline: OK</badge_1.Badge>
            </div>

            <div className="flex gap-2 pt-2">
              <button_1.Button variant={selectedStatus === 'PRESENT' ? 'default' : 'outline'} className="flex-1" onClick={() => setSelectedStatus('PRESENT')}>
                <lucide_react_1.CheckCircle className="mr-2 h-4 w-4"/> Présent
              </button_1.Button>
              <button_1.Button variant={selectedStatus === 'LATE' ? 'default' : 'outline'} className="flex-1" onClick={() => setSelectedStatus('LATE')}>
                <lucide_react_1.Clock className="mr-2 h-4 w-4"/> Retard
              </button_1.Button>
              <button_1.Button variant={selectedStatus === 'ABSENT' ? 'default' : 'outline'} className="flex-1" onClick={() => setSelectedStatus('ABSENT')}>
                <lucide_react_1.AlertCircle className="mr-2 h-4 w-4"/> Absent
              </button_1.Button>
            </div>

            <button_1.Button className="w-full" onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Enregistrement...' : 'Valider la présence'}
            </button_1.Button>
          </div>)}
      </card_1.CardContent>
    </card_1.Card>);
}
//# sourceMappingURL=student-card.js.map