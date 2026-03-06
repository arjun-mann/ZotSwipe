"use client";

import LandingPage from "./landing-page/page";
import SignInPage from "./signin-page/page";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function Home() {
  const { user, authLoading, profileLoading } = useAuthRedirect(
    "neither",
    "protectedPage",
  );

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <SignInPage />;
  }

  return <LandingPage />;
}
