"use client";

import Link from "next/link";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function Page() {
  const { user, authLoading, profileLoading } = useAuthRedirect(
    "seller",
    "protectedPage",
  );

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-foreground">
          Your guest is outside!
        </h1>
        <p className="text-2xl text-muted-foreground">Thank you!</p>
        <Link href="/">
          <Button size="lg">Return to home</Button>
        </Link>
      </div>
    </main>
  );
}
