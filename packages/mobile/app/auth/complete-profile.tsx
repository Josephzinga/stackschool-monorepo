import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function CompleteProfile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const steps = ["École", "Profil", "Rôle"];

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-center mb-4">
          Compléter le profil
        </Text>
        <Text className="text-center mb-4">
          Étape {step} / {steps.length} — {steps[step - 1]}
        </Text>

        <View className="mb-4">
          <Text className="text-center">
            (Interface mobile en cours — réimplémenter les formulaires
            spécifiques selon rôle)
          </Text>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            disabled={step === 1}
            onPress={() => setStep(Math.max(1, step - 1))}
            className="px-4 py-2 border rounded-md"
          >
            <Text>Précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (step < steps.length) setStep(step + 1);
              else router.push("/auth/login");
            }}
            className="px-4 py-2 bg-emerald-600 rounded-md"
          >
            <Text className="text-white">
              {step < steps.length ? "Suivant" : "Terminer"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
