"use client";

import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <ProtectedRoute role="seller" setupAccess="requires-complete">
      <NavigationBar userRole="seller" showSettings={false} />
      <main className="min-h-screen bg-background relative flex flex-col justify-center">
        <div className="text-center space-y-6 pt-20">
          <h1 className="text-5xl font-bold text-foreground">
            Your guest is outside!
          </h1>
          <p className="text-2xl text-muted-foreground">Thank you!</p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
