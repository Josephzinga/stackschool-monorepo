import { cn } from "@/lib/utils";
import React from "react";

interface StepperProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, className }) => {
  const numberOfSteps = steps.length;

  return (
    <div
      className={cn("w-full max-w-lg mx-auto md:ml-10 px-2 py-3", className)}>
      <div className="relative flex items-center justify-between">
        {/* Ligne de progression */}
        <div className="absolute left-0 top-[calc(50% - 13px)] -translate-y-1/2 h-3 rounded-lg w-full bg-gray-200" />
        <div
          className="absolute left-0 top-[calc(50% - 13px)] -translate-y-1/2 h-3 bg-blue-600 transition-all duration-500 ease-in-out rounded-lg"
          style={{
            width: `${((currentStep - 1) / (numberOfSteps - 1)) * 100}%`,
          }}
        />

        {/* Étapes */}
        {steps.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                  ${isCompleted ? "bg-blue-600 text-white" : ""}
                  ${
                    isCurrent
                      ? "bg-white border-2 border-blue-600 text-blue-600 scale-110"
                      : ""
                  }
                  ${
                    !isCompleted && !isCurrent
                      ? "bg-white border-2 border-gray-300 text-gray-400"
                      : ""
                  }
                `}>
                {isCompleted ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <p
                className={`mt-2 text-sm text-center font-medium transition-colors duration-300 w-24
                ${isCurrent ? "text-blue-600" : "text-gray-500"}
              `}>
                {title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
