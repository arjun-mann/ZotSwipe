"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProviderSetup() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [name, setName] = useState("");

  useEffect(() => {
    if (authLoading) return;

    // Auth is loaded, check if user is signed in
    if (!user) {
      router.push("/provider-signin");
      return;
    }

    // Wait for profile to load
    if (profileLoading) return;

    // Redirect if already has profile
    if (profile?.name) {
      router.push("/provider-dashboard");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  const handleSave = async () => {
    if (!user || !name) return;

    await updateDoc(doc(db, "users", user.uid), { name });

    router.push("/provider-dashboard");
  };

  if (authLoading || profileLoading) {
    console.log("provider-setup: Auth or profile loading...");
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Provider Setup</h1>
      <div className="text-lg">Welcome, {user.email}!</div>
      <div className="flex flex-col gap-4 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold">Enter Your Name</h1>
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSave}>Continue</Button>
      </div>
      <SignOutButton />
    </div>
  );
}
