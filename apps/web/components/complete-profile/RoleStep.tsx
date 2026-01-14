import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import StudentForm from '@/components/complete-profile/role-form/student-form';
import { allRoles, useCompleteProfileStore } from '@stackschool/ui';
import { SchoolRole } from '@stackschool/shared';
import { ParentForm } from '@/components/complete-profile/role-form/parent-form';
import { toast } from 'sonner';
import { TeacherForm } from './role-form/teacher-from';
import { cn } from '@/lib/utils';
import StaffAdminForm from '@/components/complete-profile/role-form/staff-admin-form';
import { useRouter } from 'next/navigation';

export default function RoleStep() {
  const { school, setCurrentStep, setRoleData } = useCompleteProfileStore();
  const [selectedRole, setSelectedRole] = useState<SchoolRole>();
  const router = useRouter();

  // Détermine si l'utilisateur est le créateur de l'école
  const isSchoolCreator = school?.type === 'create';

  const filteredRoles = allRoles.filter((r) =>
    isSchoolCreator ? r.value === 'ADMIN' : r.value !== 'ADMIN',
  );

  useEffect(() => {
    if (isSchoolCreator && !selectedRole) {
      setSelectedRole('ADMIN');
    }
  }, [isSchoolCreator]);

  const handleRoleSelect = (role: SchoolRole) => {
    // Si créateur d'école, seul ADMIN est autorisé
    if (isSchoolCreator && role !== 'ADMIN') {
      toast.warning(
        "En tant que créateur de l'école, vous devez être Administrateur.",
      );
      return;
    }
    setSelectedRole(role);
  };

  const renderedRoleFrom = () => {
    switch (selectedRole) {
      case 'STUDENT':
        return <StudentForm onBack={() => setSelectedRole(undefined)} />;
      case 'TEACHER':
        return <TeacherForm onBack={() => setSelectedRole(undefined)} />;
      case 'PARENT':
        return <ParentForm onBack={() => setSelectedRole(undefined)} />;
      case 'STAFF':
        return (
          <StaffAdminForm
            role="STAFF"
            onSubmit={(data) => {
              setRoleData({ role: 'STAFF', staff: data });
              setCurrentStep(4);
            }}
            onBack={() => setSelectedRole(undefined)}
          />
        );
      case 'ADMIN':
        return (
          <StaffAdminForm
            onSubmit={(data) => {
              setRoleData({ role: 'ADMIN', admin: data });
              setCurrentStep(4);
            }}
            role="ADMIN"
            onBack={() => setSelectedRole(undefined)}
          />
        );
    }
  };

  if (!selectedRole) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-sans">Votre Rôle</h2>
          {isSchoolCreator
            ? 'Configuration de votre compte administrateur'
            : 'Comment allez-vous utiliser la plateforme ?'}
          {isSchoolCreator && (
            <p className="text-amber-600 text-sm mt-2 font-jost font-medium">
              Note : Vous avez créé une école, le rôle Administrateur est
              requis.
            </p>
          )}
        </div>

        <div
          className={cn(
            'grid gap-4',
            isSchoolCreator ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2',
          )}
        >
          {filteredRoles.map((role) => (
            <Card
              key={role.value}
              className="p-6 transition-all border-border cursor-pointer hover:border-primary hover:shadow-md"
              onClick={() => handleRoleSelect(role.value)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <h3 className="font-semibold font-inter text-lg">
                    {role.label}
                  </h3>
                  <p className="text-sm text-gray-600 font-jost">
                    {role.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setCurrentStep(2)}
        >
          ← Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center space-x-4 font-poppins">
        <Button variant="outline" onClick={() => setSelectedRole(undefined)}>
          ←
        </Button>
        <div className="flex justify-cent flex-col items-center">
          <h2 className="text-2xl font-semibold">
            Informations{' '}
            {filteredRoles.find((r) => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">
            Complétez vos informations spécifiques
          </p>
        </div>
      </div>

      {renderedRoleFrom()}
    </div>
  );
}
