"use client";

import LandingPage from "./landing-page/page";
import SignInPage from "./signin-page/page";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading } = useUserProfile();

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <SignInPage />;
  }

  return <LandingPage />;
}
