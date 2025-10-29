import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import StudentForm from "./StudentForm";

export default function RoleStep({
  onComplete,
  onBack,
  selectedRole,
  onRoleSelect,
  school,
  profile,
}) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Charger les classes et matières de l'école
  useEffect(() => {
    if (school?.schoolId) {
      fetch(`/api/schools/${school.schoolId}/classes`)
        .then((r) => r.json())
        .then(setClasses);
      fetch(`/api/schools/${school.schoolId}/subjects`)
        .then((r) => r.json())
        .then(setSubjects);
    }
  }, [school?.schoolId]);

  const roles = [
    {
      value: "STUDENT",
      label: "Élève",
      description: "Je suis étudiant dans cette école",
      icon: "🎓",
    },
    {
      value: "TEACHER",
      label: "Professeur",
      description: "J'enseigne dans cette école",
      icon: "👨‍🏫",
    },
    {
      value: "PARENT",
      label: "Parent",
      description: "Je suis parent d'élève(s)",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      value: "STAFF",
      label: "Personnel",
      description: "Je travaille dans l'administration",
      icon: "💼",
    },
    {
      value: "ADMIN",
      label: "Administrateur",
      description: "Je gère cette école",
      icon: "⚙️",
    },
  ];

  if (!selectedRole) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Votre Rôle</h2>
          <p className="text-gray-600">
            Comment allez-vous utiliser la plateforme ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <Card
              key={role.value}
              className="p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => onRoleSelect(role.value)}>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{role.label}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="outline" onClick={onBack} className="w-full">
          ← Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => onRoleSelect(undefined)}>
          ←
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            Informations {roles.find((r) => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">
            Complétez vos informations spécifiques
          </p>
        </div>
      </div>

      {selectedRole === "STUDENT" && (
        <StudentForm
          classes={classes}
          onSubmit={(data) => onComplete({ role: "STUDENT", student: data })}
        />
      )}

      {selectedRole === "TEACHER" && (
        <TeacherForm
          subjects={subjects}
          classes={classes}
          onSubmit={(data) => onComplete({ role: "TEACHER", teacher: data })}
        />
      )}

      {selectedRole === "PARENT" && (
        <ParentForm
          onSubmit={(data) => onComplete({ role: "PARENT", parent: data })}
        />
      )}

      {selectedRole === "STAFF" && (
        <StaffForm
          onSubmit={(data) => onComplete({ role: "STAFF", staff: data })}
        />
      )}

      {selectedRole === "ADMIN" && (
        <AdminForm
          onSubmit={(data) => onComplete({ role: "ADMIN", admin: data })}
        />
      )}
    </div>
  );
}
