"use client";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <NavigationBar userRole="buyer" />
      <main className="min-h-screen bg-background relative flex flex-col">
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
