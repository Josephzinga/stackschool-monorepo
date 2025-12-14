import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "@stackschool/ui";
import { zodResolver } from "@stackschool/ui";
import {
  registerFormSchema,
  RegisterFormType,
  authService,
} from "@stackschool/shared";

export default function Register() {
  const router = useRouter();
  const [loadingSocial, setLoadingSocial] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema as any),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormType) => {
    try {
      const res = await authService.register(data as any);
      if (res?.ok) {
        // rediriger vers la page de finish (à créer si besoin)
        router.replace("/auth/finish");
        return;
      }
      if (res?.message) {
        Alert.alert("Info", String(res.message));
      }
    } catch (err: any) {
      Alert.alert("Erreur", err?.response?.data?.message || "Erreur réseau");
    }
  };

  const handleSocial = async (provider: "google" | "facebook") => {
    setLoadingSocial(true);
    try {
      // si le backend fournit une URL de redirection sociale, ouvrir via Linking
      const res = await authService
        .login({ identifier: "", password: "" } as any)
        .catch(() => null);
      // fallback: informer l'utilisateur
      Alert.alert(
        "Social",
        `Connexion via ${provider} non implémentée dans l'app mobile.`
      );
    } finally {
      setLoadingSocial(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-center mb-4">Bienvenue</Text>

        <TouchableOpacity
          onPress={() => handleSocial("google")}
          className="bg-red-500 py-3 rounded-md mb-3 items-center"
        >
          {loadingSocial ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">
              Continuer avec Google
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSocial("facebook")}
          className="bg-blue-600 py-3 rounded-md mb-3 items-center"
        >
          <Text className="text-white font-semibold">
            Continuer avec Facebook
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-sm text-gray-500 my-2">
          Ou continuer avec
        </Text>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <Text className="mb-1 text-sm">Nom d'utilisateur</Text>
              <TextInput
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Nom d'utilisateur"
                className="border px-3 py-2 rounded-md"
              />
              {errors.username && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.username?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <Text className="mb-1 text-sm">Email</Text>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="email@example.com"
                className="border px-3 py-2 rounded-md"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.email?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <Text className="mb-1 text-sm">Numéro WhatsApp</Text>
              <TextInput
                keyboardType="phone-pad"
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="+223 77 00 00 00"
                className="border px-3 py-2 rounded-md"
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.phoneNumber?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <Text className="mb-1 text-sm">Mot de passe</Text>
              <TextInput
                secureTextEntry
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Mot de passe"
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

        <Controller
          control={control}
          name="confirm"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="mb-1 text-sm">Confirmer le mot de passe</Text>
              <TextInput
                secureTextEntry
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Confirmer le mot de passe"
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
          disabled={isSubmitting}
          className="bg-emerald-600 py-3 rounded-md items-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">S'inscrire</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="mt-4 items-center"
        >
          <Text className="text-sm text-sky-600">
            Déjà un compte ? Connexion
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
