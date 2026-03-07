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
      if (!user) return;

      router.push("/landing-page");

      return;
    }

    if (!user) {
      router.push("/signin-page");
      return;
    }

    if (profileLoading) return;

    const setupComplete =
      userType === "buyer"
        ? Boolean(profile?.buyerSetupComplete ?? profile?.name)
        : userType === "seller"
          ? Boolean(profile?.sellerSetupComplete ?? profile?.name)
          : false;

    if (redirectMode === "setup" && setupComplete) {
      router.push(`/${userType}-dashboard`);
      return;
    }

    if (redirectMode === "protectedPage" && !setupComplete) {
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
