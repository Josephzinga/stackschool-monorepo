import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import StudentForm from '@/components/complete-profile/role-form/StudentForm';
import { useCompleteProfileStore } from '@stackschool/ui';
import { SchoolRole } from '@stackschool/shared';
import { ParentForm } from '@/components/complete-profile/role-form/parent-form1';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RoleConstant {
  value: SchoolRole;
  label: string;
  icon: string;
  description: string;
}

export default function RoleStep() {
  const { school, setCurrentStep } = useCompleteProfileStore();
  const [selectedRole, setSelectedRole] = useState<SchoolRole>();

  // Détermine si l'utilisateur est le créateur de l'école
  const isSchoolCreator = school?.type === 'create';

  const roles: RoleConstant[] = [
    {
      value: 'STUDENT',
      label: 'Élève',
      description: 'Je suis étudiant dans cette école',
      icon: '🎓',
    },
    {
      value: 'TEACHER',
      label: 'Professeur',
      description: "J'enseigne dans cette école",
      icon: '👨‍🏫',
    },
    {
      value: 'PARENT',
      label: 'Parent',
      description: "Je suis parent d'élève(s)",
      icon: '👨‍👩‍👧‍👦',
    },
    {
      value: 'STAFF',
      label: 'Personnel',
      description: "Je travaille dans l'administration",
      icon: '💼',
    },
    {
      value: 'ADMIN',
      label: 'Administrateur',
      description: 'Je gère cette école',
      icon: '⚙️',
    },
  ];

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

  if (!selectedRole) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-inter">Votre Rôle</h2>
          <p className="text-gray-600 font-poppins">
            Comment allez-vous utiliser la plateforme ?
          </p>
          {isSchoolCreator && (
            <p className="text-amber-600 text-sm mt-2 font-medium">
              Note : Vous avez créé une école, le rôle Administrateur est
              requis.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const isDisabled = isSchoolCreator && role.value !== 'ADMIN';

            return (
              <Card
                key={role.value}
                className={cn(
                  'p-6 transition-all border-border',
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed bg-muted/50'
                    : 'cursor-pointer hover:border-primary hover:shadow-md',
                )}
                onClick={() => handleRoleSelect(role.value)}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl grayscale">{role.icon}</span>
                  <div>
                    <h3
                      className={cn(
                        'font-semibold font-inter text-lg',
                        isDisabled && 'text-muted-foreground',
                      )}
                    >
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-600 font-jost">
                      {role.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4 font-poppins">
        <Button variant="outline" onClick={() => setSelectedRole(undefined)}>
          ←
        </Button>
        <div className="flex justify-cent flex-col items-center">
          <h2 className="text-2xl font-semibold">
            Informations {roles.find((r) => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">
            Complétez vos informations spécifiques
          </p>
        </div>
      </div>

      {selectedRole === 'STUDENT' && <StudentForm />}
      {selectedRole === 'PARENT' && (
        <ParentForm onBack={() => setSelectedRole(undefined)} />
      )}

      {selectedRole === 'ADMIN' && (
        <div className="text-center p-8">
          <p>Formulaire Administrateur à venir...</p>
        </div>
      )}
    </div>
  );
}
