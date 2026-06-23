import React, { useState } from "react";
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
import { ResetPasswordType, resetPasswordSchema } from "@stackschool/shared";

export default function ResetPassword() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const token = params?.token as string | undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema as any),
    mode: "onChange",
  });

  const passwordValue = watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      Alert.alert("Erreur", "Token manquant");
      return;
    }
    try {
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const json = await res.json();
      if (json?.ok) {
        Alert.alert("Succès", json.message || "Mot de passe réinitialisé");
        setTimeout(() => router.push("/auth/login"), 1500);
        return;
      }
      Alert.alert(
        "Erreur",
        json?.message || "Erreur lors de la réinitialisation"
      );
    } catch (err: any) {
      Alert.alert("Erreur", err?.message || "Erreur réseau");
    }
  };

  if (!token) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
        <View className="w-full max-w-md">
          <Text className="text-2xl font-bold text-center mb-4">
            Lien invalide
          </Text>
          <Text className="text-center mb-4">
            Le lien de réinitialisation est invalide ou a expiré.
          </Text>
          <TouchableOpacity
            className="bg-emerald-600 py-3 rounded-md items-center"
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text className="text-white">Demander un nouveau lien</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const strength = getPasswordStrength(passwordValue || "");

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-center mb-4">
          Nouveau mot de passe
        </Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <Text className="mb-1 text-sm">Nouveau mot de passe</Text>
              <TextInput
                secureTextEntry={!showPassword}
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Votre nouveau mot de passe"
                className="border px-3 py-2 rounded-md"
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.password?.message)}
                </Text>
              )}
            </View>
          )}
        />

        {passwordValue ? (
          <View className="mb-3">
            <View className="flex-row gap-1">
              {[1, 2, 3, 4, 5].map((l) => (
                <View
                  key={l}
                  className={`h-1 flex-1 rounded ${
                    l <= strength
                      ? l <= 2
                        ? "bg-red-500"
                        : l === 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </View>
            <Text className="text-xs text-gray-600">
              {strength <= 2 ? "Faible" : strength === 3 ? "Moyen" : "Fort"}
            </Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="confirm"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="mb-1 text-sm">Confirmer le mot de passe</Text>
              <TextInput
                secureTextEntry={!showConfirm}
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Confirmez votre mot de passe"
                className="border px-3 py-2 rounded-md"
              />
              {errors.confirm && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.confirm?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid}
          className="bg-emerald-600 py-3 rounded-md items-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">
              Réinitialiser le mot de passe
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="mt-4 items-center"
        >
          <Text className="text-sm text-sky-600">← Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
