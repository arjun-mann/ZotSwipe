"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { isSetupComplete } from "@/lib/helpers";

type Role = "buyer" | "seller";
type SetupAccess = "any" | "requires-complete" | "requires-incomplete";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: Role;
  setupAccess?: SetupAccess;
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

    const setupComplete = isSetupComplete(role, profile);

    if (setupAccess === "requires-complete" && !setupComplete) {
      router.replace(`/${role}-setup`);
      return;
    }

    if (setupAccess === "requires-incomplete" && setupComplete) {
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

  const setupComplete = isSetupComplete(role, profile);

  if (setupAccess === "requires-complete" && !setupComplete) {
    return <LoadingPage />;
  }

  if (setupAccess === "requires-incomplete" && setupComplete) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}
