"use client";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import SignOutButton from "@/components/SignOutButton/SignOutButton";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <main className="min-h-screen bg-background relative flex flex-col">
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <Link href="/buyer-setup">
            <Button variant="outline" size="lg">
              Buyer settings
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to landing page
            </Button>
          </Link>
          <SignOutButton />
        </div>

        <div className="pt-12 pb-8">
          <h1 className="text-6xl font-bold text-foreground text-center">
            ZotSwipe
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <div className="flex gap-8 flex-col sm:flex-row w-full max-w-7xl">
            <Link href="/buyer-waiting?location=Anteatery" className="flex-1">
              <Button
                size="lg"
                className="w-full flex-1 text-6xl sm:text-7xl md:text-8xl py-32 sm:py-40 h-auto font-bold hover:scale-[1.02] transition-transform"
              >
                Anteatery
              </Button>
            </Link>
            <Link href="/buyer-waiting?location=Brandywine" className="flex-1">
              <Button
                variant="secondary"
                size="lg"
                className="w-full flex-1 text-6xl sm:text-7xl md:text-8xl py-32 sm:py-40 h-auto font-bold hover:scale-[1.02] transition-transform"
              >
                Brandywine
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
