import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from '@stackschool/ui';
import { zodResolver } from '@stackschool/ui';
import { registerFormSchema, RegisterFormType, authService } from '@stackschool/shared';
import { SignUpForm } from '@/components/sign-up-form';

export default function Register() {
  const router = useRouter();
  const [loadingSocial, setLoadingSocial] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema as any),
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormType) => {
    try {
      const res = await authService.register(data as any);
      if (res?.ok) {
        // rediriger vers la page de finish (à créer si besoin)
        router.replace('/auth/finish');
        return;
      }
      if (res?.message) {
        Alert.alert('Info', String(res.message));
      }
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Erreur réseau');
    }
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setLoadingSocial(true);
    try {
      // si le backend fournit une URL de redirection sociale, ouvrir via Linking
      const res = await authService
        .login({ identifier: '', password: '' } as any)
        .catch(() => null);
      // fallback: informer l'utilisateur
      Alert.alert('Social', `Connexion via ${provider} non implémentée dans l'app mobile.`);
    } finally {
      setLoadingSocial(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <SignUpForm />
      </View>
    </ScrollView>
  );
}
