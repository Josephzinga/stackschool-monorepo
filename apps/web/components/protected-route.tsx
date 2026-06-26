"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUserStore} from "@stackschool/ui";
import {parseAxiosError} from "@stackschool/shared";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, isAuthenticated, fetchUser, user } = useUserStore();


  useEffect(() => {
    (async () => {
      try {
        await fetchUser();
      } catch (err) {
        const {message} = parseAxiosError(err)
      }
    })();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User is not authenticated. Redirect to login page.", user);
       router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
    );
  }

  return <>{children}</>;
}
