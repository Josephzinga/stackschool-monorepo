'use client';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { CreateSchoolForm } from '@/components/complete-profile/school-form/create-school-form';
import { InvitationForm } from '@/components/complete-profile/school-form/invitation-form';
import { SearchSchoolFrom } from '@/components/complete-profile/school-form/search-school-from';

export default function SchoolStep() {
  const [mode, setMode] = useState<'join' | 'create' | 'invite'>('join');

  return (
    <div className="space-y-6 p-3 w-full h-full">
      <div className="text-center max-h-screen">
        <CardTitle className="text-2xl font-bold ">Votre École</CardTitle>
        <CardDescription className="">
          Rejoignez votre établissement scolaire
        </CardDescription>
      </div>

      <Tabs
        className="w-full flex justify-center mx-auto"
        value={mode}
        onValueChange={(val) => setMode(val as any)}
      >
        <div className="w-full flex justify-center">
          <TabsList className="grid grid-cols-3 mb-6 gap-2 h-10">
            <TabsTrigger value="join">Rejoindre</TabsTrigger>
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="invite">Invitation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="join" className="space-y-4">
          <SearchSchoolFrom />
        </TabsContent>

        <TabsContent value="create" className="space-y-4 h-full">
          <CreateSchoolForm />
        </TabsContent>

        <TabsContent value="invite" className="space-y-4">
          <InvitationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
