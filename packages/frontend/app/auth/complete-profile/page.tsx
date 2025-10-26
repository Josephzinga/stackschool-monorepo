"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Types basés sur votre schema
type SchoolRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";
type Gender = "MALE" | "FEMALE" | "OTHER";

interface CompleteProfileData {
  school: {
    schoolId?: string;
    newSchool?: { name: string; address: string; code?: string };
    invitationCode?: string;
  };
  profile: {
    firstname: string;
    lastname: string;
    gender: Gender;
    photo?: string;
  };
  role: {
    role: SchoolRole;
    student?: Student;
    teacher?: TeacherData;
    parent?: ParentData;
    staff?: StaffData;
  };
}

export default function CompleteProfile() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<SchoolRole>();
  const router = useRouter();

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CompleteProfileData>();

  const submitCompleteProfile = async (data: CompleteProfileData) => {
    try {
      const response = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        // Gérer les erreurs
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}>
                {stepNumber}
              </div>
              <span className="text-sm mt-2">
                {stepNumber === 1 && "École"}
                {stepNumber === 2 && "Profil"}
                {stepNumber === 3 && "Rôle"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 1 && (
            <SchoolStep
              onNext={(schoolData) => {
                setValue("school", schoolData);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <ProfileStep
              onNext={(profileData) => {
                setValue("profile", profileData);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <RoleStep
              onComplete={submitCompleteProfile}
              onBack={() => setStep(2)}
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
          )}
        </div>
      </div>
    </div>
  );
}
