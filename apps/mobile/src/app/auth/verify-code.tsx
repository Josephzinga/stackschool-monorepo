import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "@stackschool/ui";
import { zodResolver } from "@stackschool/ui";
import { VerifyCodeSchema, VerifyCodeFormType } from "@stackschool/shared";

export default function VerifyCode() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tempToken = params?.token as string | undefined;
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VerifyCodeFormType>({
    resolver: zodResolver(VerifyCodeSchema as any),
    mode: "onBlur",
  });

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const onSubmit = async ({ code }: VerifyCodeFormType) => {
    try {
      const res = await fetch("/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, tempToken }),
      });
      const json = await res.json();
      if (json?.resetToken) {
        Alert.alert("Succès", json.message || "Code vérifié");
        router.push(`/auth/reset-password?token=${json.resetToken}`);
        return;
      }
      Alert.alert("Erreur", json?.message || "Code invalide");
    } catch (err: any) {
      Alert.alert("Erreur", err?.message || "Erreur réseau");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken }),
      });
      const json = await res.json();
      if (json?.ok) {
        Alert.alert("Succès", json.message || "Nouveau code envoyé");
        setCountdown(60);
        return;
      }
      Alert.alert("Erreur", json?.message || "Erreur lors de l'envoi");
    } catch (err: any) {
      Alert.alert("Erreur", err?.message || "Erreur réseau");
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-center mb-4">
          Vérification du code
        </Text>
        <Text className="text-center text-sm text-gray-500 mb-4">
          Entrez le code à 6 chiffres envoyé
        </Text>

        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <TextInput
                id="code"
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                maxLength={6}
                placeholder="000000"
                className="border px-3 py-2 rounded-md text-center text-lg"
              />
              {errors.code && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.code?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-emerald-600 py-3 rounded-md items-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Vérifier le code</Text>
          )}
        </TouchableOpacity>

        <View className="mt-4 items-center">
          {countdown > 0 ? (
            <Text className="text-sm text-gray-600">
              Nouveau code dans{" "}
              <Text className="text-emerald-400">{countdown}</Text> s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-sm text-sky-600">Renvoyer le code</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="mt-6 items-center"
        >
          <Text className="text-sm text-sky-600">← Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
