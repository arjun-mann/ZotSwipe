"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

type Role = "buyer" | "seller";
type SetupAccess = "any" | "requires-complete" | "requires-incomplete";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: Role;
  setupAccess?: SetupAccess;
}

function getSetupComplete(
  role: Role,
  profile: ReturnType<typeof useUserProfile>["profile"],
) {
  if (!profile) return false;

  if (role === "buyer") {
    return Boolean(profile.buyerSetupComplete ?? profile.name);
  }

  return Boolean(profile.sellerSetupComplete ?? profile.name);
}

export default function ProtectedRoute({
  children,
  role,
  setupAccess = "any",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace("/signin-page");
      return;
    }

    if (!role || setupAccess === "any") {
      return;
    }

    const isSetupComplete = getSetupComplete(role, profile);

    if (setupAccess === "requires-complete" && !isSetupComplete) {
      router.replace(`/${role}-setup`);
      return;
    }

    if (setupAccess === "requires-incomplete" && isSetupComplete) {
      router.replace(`/${role}-dashboard`);
    }
  }, [authLoading, profileLoading, user, role, setupAccess, profile, router]);

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <LoadingPage />;
  }

  if (!role || setupAccess === "any") {
    return <>{children}</>;
  }

  const isSetupComplete = getSetupComplete(role, profile);

  if (setupAccess === "requires-complete" && !isSetupComplete) {
    return <LoadingPage />;
  }

  if (setupAccess === "requires-incomplete" && isSetupComplete) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}
