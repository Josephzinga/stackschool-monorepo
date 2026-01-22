'use client';

import SchoolStep from '../../../components/complete-profile/schoolStep';
import {Container} from '@/components/Container';

import {useCompleteProfileStore, useUserStore} from '@stackschool/ui';
import {School} from '@stackschool/shared';
import ProtectedRoute from '@/components/protected-route';
import Stepper from '@/components/Stepper';
import RoleStep from '@/components/complete-profile/RoleStep';
import * as React from 'react';
import {useEffect} from 'react';
import ReviewStep from '@/components/complete-profile/review-step';
import {Card} from '@/components/ui/card';
import {ProfileStep} from '@/components/complete-profile/profile-step';
import {toast} from 'sonner';

export type CompleteProfileData = {
  school: {
    schoolId?: string;
    newSchool?: School;
    invitationCode?: string;
  };
};

export default function CompleteProfile() {
  const { isAuthenticated } = useUserStore();
  const { currentStep, error, setCurrentStep, loadFromRedis, setError } =
    useCompleteProfileStore();
  const steps = ['école', 'Profile', 'Rôle'];
  const totalSteps = steps.length;

  useEffect(() => {
    loadFromRedis();
  }, []);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError, currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SchoolStep />;
      case 2:
        return <ProfileStep />;
      case 3:
        return <RoleStep />;
      case 4:
        return <ReviewStep />;
    }
  };

  return (
    <ProtectedRoute>
      <Container className="flex justify-center items-center">
        <div>
          <div className="w-full flex flex-col justfy-center items-center ">
            <Stepper
              className="w-full h-15"
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              steps={steps}
            />
          </div>

          {/* Partie formulaire - scrollable */}
          <div className="w-full flex justify-center py-8 md:py-12 overflow-y">
            <Card className="w-full p-6 md:w-md lg:w-lg min-h-150 ">
              {renderStepContent()}
            </Card>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
{
  /*       <div className="w-full h-fit md:sticky md:top-0 md:h-screen flex flex-col justify-between bg-slate-700/40 p-4 md:p-6">
            <div className="flex justify-center w-full">


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
          </div>     */
}
