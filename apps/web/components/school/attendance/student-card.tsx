import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
  useGetStudentDetailsQuery,
  useMarkStudentAttendanceMutation,
} from '@stackschool/ui';

interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  className: string;
  financialStatus: 'OK' | 'LATE' | 'BLOCKED';
  disciplineStatus: 'OK' | 'WARNING' | 'SANCTION';
  photo?: string;
}

export function StudentScanCard() {
  const [studentId, setStudentId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'PRESENT' | 'ABSENT' | 'LATE'
  >('PRESENT');

  const {
    data: studentData,
    refetch,
    isFetching,
  } = useGetStudentDetailsQuery({
    id: studentId,
  });
  const { mutateAsync, isPending } = useMarkStudentAttendanceMutation();
  const studentInfo = studentData?.student;
  const handleScan = async () => {
    if (studentId.length > 0) {
      await refetch();
    }
  };

  const handleSubmit = () => {
    console.log('onSubmit');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scanner un élève</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="ID du badge ou nom"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          />
          <Button onClick={handleScan} disabled={isFetching}>
            {isFetching ? 'Chargement...' : 'Chercher'}
          </Button>
        </div>

        {studentInfo && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              {studentInfo.user?.profile?.photo && (
                <img
                  src={studentInfo.user.profile?.photo}
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
              )}
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
              <Badge variant={'default'}>Frais: En retard</Badge>
              <Badge variant="outline">Discipline: OK</Badge>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant={selectedStatus === 'PRESENT' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setSelectedStatus('PRESENT')}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Présent
              </Button>
              <Button
                variant={selectedStatus === 'LATE' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setSelectedStatus('LATE')}
              >
                <Clock className="mr-2 h-4 w-4" /> Retard
              </Button>
              <Button
                variant={selectedStatus === 'ABSENT' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setSelectedStatus('ABSENT')}
              >
                <AlertCircle className="mr-2 h-4 w-4" /> Absent
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? 'Enregistrement...' : 'Valider la présence'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
