'use client';

import SchoolStep from '../../../components/complete-profile/schoolStep';
import {Container} from '@/components/Container';

import {useCompleteProfileStore, useUserStore} from '@stackschool/ui';
import {SchoolContract} from '@stackschool/contracts';
import ProtectedRoute from '@/components/providers/protected-route';
import Stepper from '@/components/Stepper';
import RoleStep from '@/components/complete-profile/RoleStep';
import * as React from 'react';
import {useEffect} from 'react';
import ReviewStep from '@/components/complete-profile/review-step';
import {ProfileStep} from '@/components/complete-profile/profile-step';
import {toast} from 'sonner';
import {Card} from "@/components/ui/card";

export type CompleteProfileData = {
  school: {
    schoolId?: string;
    newSchool?: SchoolContract;
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
            <Card className="w-full bg-gray-950 p-6 md:w-md lg:w-lg min-h-150 ">
              {renderStepContent()}
            </Card>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
{
 }
