"use client";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import NavigationBar from "@/components/NavigationBar/NavigationBar";

export default function Page() {
  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <NavigationBar userRole="buyer" showSettings={false} />
      <main className="min-h-screen bg-background relative flex flex-col justify-center">
        <div className="text-center space-y-6 pt-20">
          <h1 className="text-5xl font-bold text-foreground">
            Your seller will be with you shortly!
          </h1>
          <p className="text-2xl text-muted-foreground">Thank you!</p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
