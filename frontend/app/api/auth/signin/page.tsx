// pages/signin.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SigninPage() {
  const [csrfToken, setCsrfToken] = useState("");
  /*
  useEffect(() => {
    // Récupérer le jeton CSRF au chargement de la page
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/auth/csrf`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
        console.log("Jeton CSRF récupéré:", response.data.csrfToken);
      } catch (error) {
        console.error("Erreur lors de la récupération du jeton CSRF:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:4000/auth/signin/google`,
          {
            withCredentials: true,
          }
        );
        console.log("Réponse de l'API:", response.data);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <form action={`http://localhost:4000/auth/signin/google`} method="POST">
      <h1>Se connecter</h1>
      <button type="submit">Se connecter avec google</button>
    </form>
  );*/

  // Dans votre composant React / Next.js
  // Si vous l'utilisez pour d'autres appels

  // useEffect et la récupération du CSRF ne sont pas nécessaires pour Google
  // Supprimez ce bloc de code

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:4000/auth/callback/google`;
  };

  return (
    <div>
      <h1>Se connecter</h1>
      <button onClick={handleGoogleLogin}>Se connecter avec google</button>
    </div>
  );
}

// Note: Le CSRF token n'est pas nécessaire pour les connexions OAuth comme Google
// Il est principalement utilisé pour les connexions par identifiants (credentials)
