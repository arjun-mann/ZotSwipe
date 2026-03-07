"use client";

import SignInTabs from "@/components/SignInTabs/SignInTabs";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function SignIn() {
  const { user, authLoading } = useAuthRedirect("neither", "signin");

  if (authLoading) {
    return <LoadingPage />;
  }

  if (user) {
    return null;
  }

  return (
    <>
      <NavigationBar
        showSettings={false}
        showSignOut={false}
        showSignIn={false}
      />
      <div className="min-h-screen bg-background relative flex flex-col">
        <div className="pt-24 pb-8">
          <h1 className="text-6xl font-bold text-foreground text-center">
            ZotSwipe
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-16">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <SignInTabs />
        </div>
      </div>
    </>
  );
}
