"use client";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { useProviderRedirect } from "@/hooks/useProviderRedirect";

export default function ProviderDashboard() {
  const { user, profile, authLoading, profileLoading } =
    useProviderRedirect("dashboard");

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
