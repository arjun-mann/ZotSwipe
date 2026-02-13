"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProviderDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (authLoading) return;

    // Auth is loaded, check if user is signed in
    if (!user) {
      router.push("/provider-signin");
      return;
    }

    // Wait for profile to load
    if (profileLoading) return;

    // Redirect if hasn't completed setup
    if (!profile?.name) {
      router.push("/provider-setup");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Provider Dashboard</h1>
      <div className="text-lg">Welcome to your dashboard, {profile.name}!</div>
      <SignOutButton />
    </div>
  );
}
