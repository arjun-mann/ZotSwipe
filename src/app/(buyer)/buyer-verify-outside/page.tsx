"use client";

import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <main className="min-h-screen bg-background relative flex flex-col justify-center">
        <div className="flex flex-col text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground">
            Verify outside entrance
          </h1>
          <p className="text-2xl text-muted-foreground">
            Describe your outfit!
          </p>
          <Input
            placeholder="Type here..."
            className="w-64 mx-auto text-center"
          />
          <Link href="/buyer-thanks">
            <Button size="lg">Verify!</Button>
          </Link>
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
