"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

type ProviderRedirectMode = "signin" | "setup" | "dashboard";

export function useProviderRedirect(mode: ProviderRedirectMode) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (authLoading) return;

    if (mode === "signin") {
      if (!user || profileLoading) return;

      if (profile?.name) {
        router.push("/provider-dashboard");
      } else {
        router.push("/provider-setup");
      }

      return;
    }

    if (!user) {
      router.push("/provider-signin");
      return;
    }

    if (profileLoading) return;

    if (mode === "setup" && profile?.name) {
      router.push("/provider-dashboard");
      return;
    }

    if (mode === "dashboard" && !profile?.name) {
      router.push("/provider-setup");
    }
  }, [mode, user, profile, authLoading, profileLoading, router]);

  return { user, profile, authLoading, profileLoading };
}
