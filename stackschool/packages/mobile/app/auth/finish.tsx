import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Finish() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md items-center">
        <Text className="text-3xl font-bold text-center mb-4">
          Inscription terminée
        </Text>
        <Text className="text-center mb-6">
          Votre compte a été créé. Veuillez vérifier votre boîte mail ou
          terminer votre profil.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="bg-emerald-600 py-3 rounded-md w-full items-center"
        >
          <Text className="text-white font-semibold">Aller à la connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
