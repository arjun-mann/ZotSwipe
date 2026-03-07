"use client";

import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <NavigationBar userRole="buyer" showSettings={false} />
      <main className="min-h-screen bg-background relative flex flex-col justify-center">
        <div className="flex flex-col text-center space-y-6 pt-20">
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
        </div>
      </main>
    </ProtectedRoute>
  );
}
