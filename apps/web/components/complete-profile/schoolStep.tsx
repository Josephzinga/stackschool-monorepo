'use client';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { useState } from 'react';
import { CreateSchoolForm } from '@/components/complete-profile/school-form/create-school-form';
import { InvitationForm } from '@/components/complete-profile/school-form/invitation-form';
import { SearchSchoolFrom } from '@/components/complete-profile/school-form/search-school-from';
import {
  AppTabsContent,
  AppTabsList,
  AppTabsTrigger,
} from '@/components/app-tabs';

interface Value {
  value: 'join' | 'create' | 'invite';
  label: string;
}

export default function SchoolStep() {
  const [mode, setMode] = useState<Value['value']>('join');
  const constant: Value[] = [
    { value: 'join', label: 'Rejoindre' },
    { value: 'create', label: 'Crée' },
    { value: 'invite', label: 'Invitation' },
  ];
  return (
    <div className="space-y-6 p-3 w-full h-full">
      <div className="text-center max-h-screen">
        <CardTitle className="text-2xl font-bold ">Votre École</CardTitle>
        <CardDescription className="">
          Rejoignez votre établissement scolaire
        </CardDescription>
      </div>

      <Tabs
        className="space-y-4"
        value={mode}
        onValueChange={(val) => setMode(val as Value['value'])}
      >
        <div className="w-full flex justify-center">
          <AppTabsList className="h-10 w-full bg-[#232423] duration-300">
            {constant.map((item) => (
              <AppTabsTrigger key={item.value} value={item.value}>
                {item.label}
              </AppTabsTrigger>
            ))}
          </AppTabsList>
        </div>

        <AppTabsContent value="join">
          <SearchSchoolFrom />
        </AppTabsContent>

        <AppTabsContent className="flex-1" value="create">
          <CreateSchoolForm />
        </AppTabsContent>

        <AppTabsContent value="invite">
          <InvitationForm />
        </AppTabsContent>
      </Tabs>
    </div>
  );
}
