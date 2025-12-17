"use client";

import { Container } from "@/components/Container";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@stackschool/shared";
import { LucideOctagonX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthFinish() {
  const search = useSearchParams();
  const router = useRouter();
  const from = search?.get("from") ?? "";
  const provider = search?.get("provider") ?? "";

  const [status, setStatus] = useState<
    "loading" | "ok" | "need_onboar" | "error"
  >("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getMe();
        // si connecté
        if (data?.user) {
          const profile = data.user?.profile;
          // si le profile est manquant
          if (!profile || profile.firstname === "" || profile.lastname === "") {
            setStatus("need_onboar");
            router.replace(`/auth/complete-profile?provider=${provider}`);
            return;
          }
          setStatus("ok");
          router.replace("/dashboard");
          return;
        }
        // sin non connecté, on tente de rafrechire la session
        const refreshData = await authService.refresh();
        // si le rafrechisement reuissi
        if (refreshData.ok) {
          const data2 = await authService.getMe();

          if (data2?.user) {
            if (!data2?.user.profile || !data2.user?.profile.fistname) {
              router.replace(
                `/auth/complete-profile?provider=${encodeURIComponent(
                  provider
                )}`
              );
              return;
            }
            router.replace("/dashboard");
            return;
          }
        }
        // si toujours pas connecté -> afficher erreur
        setStatus("error");
        setMsg(
          "Impossible de valider la connexion. Réessaie ou contacte le support."
        );
      } catch (error) {
        setStatus("error");
        setMsg("Erreur réseaux");
        console.log("Erreur refresh user:", error);
      }
    };
    checkAuth();
  }, [router, provider, from]);

  return (
    <Container>
      <div className="flex flex-col items-center gap-4 bg-gray-700/60 relative h-45  rounded-2xl">
        {status === "loading" && (
          <>
            <Spinner className="absolut w-10 md:w-15 h-10 md:h-15 left-1/2 mt-4" />
            <span className="text-xl animate-pulse font-medium px-3">
              Verification de la connexion via {provider || "le fourniseur"}…
            </span>
          </>
        )}
        {status === "error" && (
          <>
            <LucideOctagonX className="w-10 md:w-15 h-10 md:h-15 text-red-500" />
            <span>{msg}</span>
          </>
        )}
      </div>
    </Container>
  );
}
