import React from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import api, { parseAxiosError } from '@stackschool/shared/src/lib/api';
import { SocialButton, SocialStrategy } from './social-button';
import { saveSession } from '@/lib/token-storage';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export default function FacebookLoginButton() {
  const strategy: SocialStrategy = {
    provider: 'facebook',
    source: { uri: 'https://img.clerk.com/static/facebook.png?width=160' },
    useTint: false,
  };

  const handleFacebookLogin = async () => {
    try {
      // 1. Demander la permission
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        Toast.show({
          type: 'error',
          text1: 'Connexion annulée',
        });
        return;
      }

      // 2. Récupérer le token d'accès
      const accessData = await AccessToken.getCurrentAccessToken();
      if (!accessData) {
        throw new Error('Erreur lors de la récupération du token Facebook');
      }

      const accessToken = accessData.accessToken.toString();
      console.log('Access Token', accessToken);
      // 3. Envoyer à ton API Node/Express
      console.log('Envoi du token Facebook à l’API...');
      const res = await api.post('/auth/facebook', { accessToken });
      const { data } = res;
      if (data.ok) {
        await saveSession(res.data.session);
        if (data.ok) {
          Toast.show({
            type: 'success',
            text1: data.message || 'Authentification réuissi avec succé!',
            text1Style: { color: 'green' },
          });
          if (!data.user.profileCompleted) {
            router.push('/auth/complete-profile');
          }
          router.push('/home');
        }
      }
      console.log('Réponse API:', res.data);
    } catch (error) {
      const { message } = parseAxiosError(error);
      console.log('Erreur Facebook:', message);
    }
  };

  return <SocialButton strategy={strategy} onPress={handleFacebookLogin} />;
}
