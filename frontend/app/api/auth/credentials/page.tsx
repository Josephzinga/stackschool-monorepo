"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInCredentials() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL;
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

  const handleCredentials = () => {
    if (!csrfToken) {
      console.error(
        "Jeton CSRF manquant dans signInCredentials. Impossible de se connecter."
      );
      return;
    }
  };

  return (
    <form
      action={`http://localhost:4000/auth/callback/credentials`}
      method="POST">
      <label htmlFor="email">Email:</label>

      <input
        placeholder="email"
        id="email"
        name="email"
        autoComplete="email"
        type="email"
      />
      <label htmlFor="password">Mot de passe:</label>
      <input
        placeholder="password"
        id="password"
        name="password"
        autoComplete="current-password"
        type="password"
      />
      <button type="submit" onClick={handleCredentials}>
        Se connecter
      </button>
    </form>
  );
}
