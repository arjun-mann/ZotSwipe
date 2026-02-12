"use client";

import Link from "next/link";
import SignInTabs from "@/components/SignInTabs/SignInTabs";
import { Button } from "@/components/ui/button";

export default function ProviderSignIn() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <div className="absolute top-6 right-6 z-10">
        <Link href="/" className="flex-1">
          <Button variant="outline" size="lg">
            I&apos;m a Buyer
          </Button>
        </Link>
      </div>

      <div className="pt-12 pb-8">
        <h1 className="text-6xl font-bold text-foreground text-center">
          ZotSwipe
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-16">
        <h2 className="text-3xl font-bold">Create Provider Profile</h2>
        <SignInTabs />
      </div>
    </div>
  );
}
