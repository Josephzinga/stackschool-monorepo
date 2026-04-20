'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StudentScanCard } from '@/components/school/attendance/student-card';
import { EmployeeQRGenerator } from '@/components/school/attendance/employee-QR-generator';
import { ManualAttendanceTable } from '@/components/school/attendance/manual-attendace-table';

export default function AttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [roleFilter, setRoleFilter] = useState<string>('STUDENT');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des présences</h1>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRoleFilter('STUDENT')}>
            Élèves
          </Button>
          <Button variant="outline" onClick={() => setRoleFilter('TEACHER')}>
            Enseignants
          </Button>
          <Button variant="outline" onClick={() => setRoleFilter('STAFF')}>
            Personnel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scan">
        <TabsList>
          <TabsTrigger value="scan">Scanner élève</TabsTrigger>
          <TabsTrigger value="qr">Générer QR</TabsTrigger>
          <TabsTrigger value="manual">Pointage manuel</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-4">
          <StudentScanCard />
        </TabsContent>

        <TabsContent value="qr" className="mt-4">
          <EmployeeQRGenerator />
        </TabsContent>

        <TabsContent value="manual" className="mt-4">
          <ManualAttendanceTable date={selectedDate} roleFilter={roleFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
