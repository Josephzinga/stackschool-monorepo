import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CompleteProfile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const steps = ['École', 'Profil', 'Rôle'];

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="mb-4 text-center text-2xl font-bold">Compléter le profil</Text>
        <Text className="mb-4 text-center">
          Étape {step} / {steps.length} — {steps[step - 1]}
        </Text>

        <View className="mb-4">
          <Text className="text-center">
            (Interface mobile en cours — réimplémenter les formulaires spécifiques selon rôle)
          </Text>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            disabled={step === 1}
            onPress={() => setStep(Math.max(1, step - 1))}
            className="rounded-md border px-4 py-2">
            <Text>Précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (step < steps.length) setStep(step + 1);
              else router.push('/auth/login');
            }}
            className="rounded-md bg-emerald-600 px-4 py-2">
            <Text className="text-white">{step < steps.length ? 'Suivant' : 'Terminer'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
