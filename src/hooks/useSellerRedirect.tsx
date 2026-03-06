"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

type SellerRedirectMode = "signin" | "setup" | "dashboard";

export function useSellerRedirect(mode: SellerRedirectMode) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (authLoading) return;

    if (mode === "signin") {
      if (!user || profileLoading) return;

      if (profile?.name) {
        router.push("/seller-dashboard");
      } else {
        router.push("/seller-setup");
      }

      return;
    }

    if (!user) {
      router.push("/seller-signin");
      return;
    }

    if (profileLoading) return;

    if (mode === "setup" && profile?.name) {
      router.push("/seller-dashboard");
      return;
    }

    if (mode === "dashboard" && !profile?.name) {
      router.push("/seller-setup");
    }
  }, [mode, user, profile, authLoading, profileLoading, router]);

  return { user, profile, authLoading, profileLoading };
}
