"use client";

import { useAuth } from "@/components/AuthProvider/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import SetupForm from "@/components/SetupForm/SetupForm";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function SellerSetup() {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  if (!user) return null;

  return (
    <ProtectedRoute role="seller" setupAccess="any">
      <SetupForm
        role="seller"
        userId={user.uid}
        userEmail={user.email}
        profile={profile}
      />
    </ProtectedRoute>
  );
}
