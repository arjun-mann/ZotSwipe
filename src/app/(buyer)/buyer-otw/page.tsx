"use client";

import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <main className="min-h-screen bg-background relative flex flex-col justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground">
            Your guest has been notified
          </h1>
          <p className="text-2xl text-muted-foreground">
            They are on their way
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/">
              <Button variant="outline">Back to landing page</Button>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
