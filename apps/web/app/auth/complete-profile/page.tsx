"use client";

import SchoolStep from "../../../components/complete-profile/schoolStep";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/card";

import { UseCompleteProfileStore } from "@stackschool/ui";
import Stepper from "@/components/Stepper";
import { School } from "@stackschool/shared";
import { useSearchParams } from "next/navigation";
import { ProfileStep } from "@/components/complete-profile/profile-step";
import ProtectedRoute from "@/components/protected-route";

export type CompleteProfileData = {
  school: {
    schoolId?: string;
    newSchool?: School;
    invitationCode?: string;
  };
};

export default function CompleteProfile() {
  const search = useSearchParams();
  const provider = search.get("provider");
  const { currentStep, setCurrentStep } = UseCompleteProfileStore();
  const steps = ["école", "Profile", "Rôle"];
  const totalSteps = steps.length;

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SchoolStep />;
      case 2:
        return <ProfileStep />;
      case 3:
        return <div>Role step</div>;
      case 4:
        return <div>FianlStep</div>;
      default:
        null;
    }
  };

  return (
    <ProtectedRoute>
      <Container>
        {/* Modifications principales ici */}
        <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
          {/* Partie guide - fixe */}
          <div className="w-full h-fit md:sticky md:top-0 md:h-screen flex flex-col justify-between bg-slate-700/40 p-4 md:p-6">
            <div className="flex justify-center w-full">
              <Stepper
                className="w-full"
                currentStep={
                  currentStep > totalSteps ? totalSteps + 1 : currentStep
                }
                steps={steps}
              />
            </div>

            <div className="mt-6 md:mt-8">
              {currentStep <= totalSteps ? (
                <div className="flex justify-between w-full">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="px-6 py-2 text-blue-600 bg-transparent border border-blue-600 rounded-md font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    {currentStep === totalSteps ? "Terminer" : "Suivant"}
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 text-white bg-green-600 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Partie formulaire - scrollable */}
          <div className="w-full flex justify-center py-8 md:py-12 overflow-y-auto">
            <Card className="h-full lg:min-w-140 p-6 dark:bg-slate-700/50 ">
              {renderStepContent()}
            </Card>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
