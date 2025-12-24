import React, { useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import api, { parseAxiosError } from '@stackschool/shared/src/lib/api';
import { SocialButton, SocialStrategy } from './social-button';
import { saveSession } from '@/lib/token-storage';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

console.log('GOOGLE_WEB_CLIENT_ID', GOOGLE_WEB_CLIENT_ID);

export default function GoogleLoginButton() {
  useEffect(() => {
    // Initialisation de la configuration Google
    GoogleSignin.configure({
      // ID Client de type "Application Web" (crucial pour l'idToken)
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true, // Permet de récupérer un code pour le backend si besoin
    });
  }, []);

  const strategy: SocialStrategy = {
    provider: 'google',
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
  };

  const handleGoogleLogin = async () => {
    try {
      // 1. Vérifie que les services Google Play sont disponibles (Android uniquement)
      await GoogleSignin.hasPlayServices();

      // 2. Ouvre la modale native de connexion
      const userInfo = await GoogleSignin.signIn();

      // 3. Récupère l'idToken
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        console.log("Erreur : Aucun ID Token n'a été généré");
        return;
      }

      // 4. Envoi à ton API Node/Express
      console.log('Envoi du token à l’API...', idToken);
      const res = await api.post('/auth/google', { idToken });

      console.log('Réponse API:', res.data);
      console.log('Session', res.data.session);
      await saveSession(res.data.session);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Utilisateur a annulé la connexion');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Connexion déjà en cours');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Services Google Play non disponibles');
      } else {
        const { message } = parseAxiosError(error);
        console.log('Erreur détaillée:', message);
      }
    }
  };

  return <SocialButton strategy={strategy} onPress={handleGoogleLogin} />;
}
