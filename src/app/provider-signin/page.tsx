"use client";

import SignInTabs from "@/components/SignInTabs/SignInTabs";

export default function ProviderSignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Create Provider Profile</h1>
      <SignInTabs />
    </div>
  );
}
