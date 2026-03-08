"use client";

import { useAuth } from "@/components/AuthProvider/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useUserProfile } from "@/hooks/useUserProfile";
import SetupForm from "@/components/SetupForm/SetupForm";

export default function BuyerSetup() {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  if (!user) return null;

  return (
    <ProtectedRoute role="buyer" setupAccess="any">
      <SetupForm
        role="buyer"
        userId={user.uid}
        userEmail={user.email}
        profile={profile}
      />
    </ProtectedRoute>
  );
}
