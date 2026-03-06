"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

type UserType = "buyer" | "seller" | "neither";
type RedirectMode = "signin" | "setup" | "protectedPage";

export function useAuthRedirect(
  userType: UserType,
  redirectMode: RedirectMode,
) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (authLoading) return;

    if (redirectMode === "signin") {
      if (!user || profileLoading) return;

      if (profile?.name) {
        router.push(`/${userType}-dashboard`);
      } else {
        router.push(`/${userType}-setup`);
      }

      return;
    }

    if (!user) {
      router.push("/signin");
      return;
    }

    if (profileLoading) return;

    if (redirectMode === "setup" && profile?.name) {
      router.push(`/${userType}-dashboard`);
      return;
    }

    if (redirectMode === "protectedPage" && !profile?.name) {
      router.push(`/${userType}-setup`);
    }
  }, [
    userType,
    redirectMode,
    user,
    profile,
    authLoading,
    profileLoading,
    router,
  ]);

  return { user, profile, authLoading, profileLoading };
}
