'use client';

import { useUserStore } from '@stackschool/ui';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { School, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SelectSchoolPage() {
  const { user, setCurrentSchool } = useUserStore();
  const router = useRouter();

  if (!user) return null; // Ou loader

  const handleSelect = (membership: any) => {
    setCurrentSchool(membership.school);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-inter">Choisir une école</h1>
          <p className="text-muted-foreground">
            Vous êtes membre de plusieurs établissements. Lequel souhaitez-vous
            accéder ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.memberships?.map((membership: any) => (
            <Card
              key={membership.school.id}
              className="p-6 cursor-pointer hover:border-primary transition-all hover:shadow-md group"
              onClick={() => handleSelect(membership)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage src={`/images/${membership.school.logo}`} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      <School className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {membership.school.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {membership.role.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <Check className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="link"
            className="text-lg"
            onClick={() => router.push('/auth/complete-profile')}
          >
            Rejoindre ou créer une autre école
          </Button>
        </div>
      </div>
    </div>
  );
}
