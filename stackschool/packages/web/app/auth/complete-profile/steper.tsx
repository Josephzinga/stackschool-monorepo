import React, { useState } from "react";
import Stepper from "@/components/Stepper";
import { UseCompleteProfileStore } from "@/store/complete-profiile-store";

// Contenu pour l'étape 1
const Step1: React.FC = () => (
  <div className="text-center animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Étape 1: Informations Personnelles
    </h2>
    <p className="text-gray-600">
      Veuillez entrer vos informations personnelles pour commencer.
    </p>
  </div>
);

// Contenu pour l'étape 2
const Step2: React.FC = () => (
  <div className="text-center animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Étape 2: Détails du Compte
    </h2>
    <p className="text-gray-600">
      Choisissez un nom d'utilisateur et un mot de passe sécurisé.
    </p>
  </div>
);

// Contenu pour l'étape 3
const Step3: React.FC = () => (
  <div className="text-center animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Étape 3: Confirmation
    </h2>
    <p className="text-gray-600">
      Vérifiez vos informations et terminez votre inscription.
    </p>
  </div>
);

// Contenu pour l'étape finale
const FinalStep: React.FC = () => (
  <div className="text-center animate-fade-in">
    <svg
      className="w-16 h-16 mx-auto text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <h2 className="text-2xl font-bold text-green-600 mt-4">Félicitations !</h2>
    <p className="text-gray-600 mt-2">
      Votre processus est terminé avec succès.
    </p>
  </div>
);

const App: React.FC = () => {
  const { currentStep, setCurrentStep } = UseCompleteProfileStore();
  const steps = ["école", "Profile", "Rôle"];
  const totalSteps = steps.length;

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(Math.min(currentStep - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <FinalStep />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 w-full max-w-3xl">
        <Stepper
          currentStep={currentStep > totalSteps ? totalSteps + 1 : currentStep}
          steps={steps}
        />

        <div className="my-10 min-h-[150px] flex items-center justify-center p-4 border-t border-b border-gray-200">
          {renderStepContent()}
        </div>

        {/* Boutons de navigation */}
        {currentStep <= totalSteps ? (
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 text-blue-600 bg-transparent border border-blue-600 rounded-md font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
              Précédent
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
              {currentStep === totalSteps ? "Terminer" : "Suivant"}
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 text-white bg-green-600 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300">
              Recommencer
            </button>
          </div>
        )}
      </div>
      <style>{`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default App;
