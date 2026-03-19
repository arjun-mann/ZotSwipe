"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    if (!requestId) return;

    const unsubscribe = onSnapshot(doc(db, "buyerRequests", requestId), (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      if (data?.status === "arrived") {
        router.push("/seller-thanks");
      }
    });

    return () => unsubscribe();
  }, [requestId, router]);

  return (
    <ProtectedRoute role="buyer" setupAccess="any">
      <NavigationBar userRole="buyer" showSettings={false} />
      <main className="min-h-screen bg-background relative flex flex-col justify-center">
        <div className="text-center space-y-6 pt-20">
          <h1 className="text-5xl font-bold text-foreground">
            Your guest has been notified
          </h1>
          <p className="text-2xl text-muted-foreground">
            They are on their way
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
