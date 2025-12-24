import React from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import api, { parseAxiosError } from '@stackschool/shared/src/lib/api';
import { SocialButton, SocialStrategy } from './social-button';
import { saveSession } from '@/lib/token-storage';

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
        console.log('Connexion annulée');
        return;
      }

      // 2. Récupérer le token d'accès
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Erreur lors de la récupération du token Facebook');
      }

      const accessToken = data.accessToken.toString();
      console.log('Access Token', accessToken);
      // 3. Envoyer à ton API Node/Express
      console.log('Envoi du token Facebook à l’API...');
      const res = await api.post('/auth/facebook', { accessToken });
      if (res.data.ok) {
        await saveSession(res.data.session);
      }
      console.log('Réponse API:', res.data);
    } catch (error) {
      const { message } = parseAxiosError(error);
      console.log('Erreur Facebook:', message);
    }
  };

  return <SocialButton strategy={strategy} onPress={handleFacebookLogin} />;
}
