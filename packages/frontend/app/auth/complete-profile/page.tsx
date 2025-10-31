"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import RoleStep from "./RoleStep";
import {
  SchoolRole,
  Gender,
  Staff,
  Student,
  School,
  Teacher,
  SchoolUser,
  Profile,
  User,
} from "@stackschool/db";
import SchoolStep from "../../../components/complete-profile/schoolStep";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/card";

// Types basés sur votre schema

export type CompleteProfileData = {
  school: {
    schoolId?: string;
    newSchool?: School;
    invitationCode?: string;
  };
};

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
    <Container>
      <div className="max-w-2xl w-full ">
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

        <Card className="bg-white/50 dark:bg-slate-800/50 rounded-lg shadow-lg p-6">
          {step === 1 && <SchoolStep />}

          {/*  {step === 2 && (
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
          )} */}
        </Card>
      </div>
    </Container>
  );
}
