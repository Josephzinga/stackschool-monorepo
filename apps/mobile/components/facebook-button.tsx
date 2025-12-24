import React from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import api, { parseAxiosError } from '@stackschool/shared/src/lib/api';
import { SocialButton, SocialStrategy } from './social-button';

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

      // 3. Envoyer à ton API Node/Express
      console.log('Envoi du token Facebook à l’API...');
      const res = await api.post('/auth/facebook', { accessToken });

      console.log('Réponse API:', res.data);
    } catch (error) {
      const { message } = parseAxiosError(error);
      console.log('Erreur Facebook:', message);
    }
  };

  return <SocialButton strategy={strategy} onPress={handleFacebookLogin} />;
}
