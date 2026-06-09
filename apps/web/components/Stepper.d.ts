import React from 'react';
interface StepperProps {
    currentStep: number;
    steps: string[];
    className?: string;
    setCurrentStep: (step: number) => void;
}
declare const Stepper: React.FC<StepperProps>;
export default Stepper;
//# sourceMappingURL=Stepper.d.ts.map