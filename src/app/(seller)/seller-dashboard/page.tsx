"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { db } from "@/lib/firebase";
import { getTimeAgo } from "@/lib/helpers";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

interface Buyer {
  id: string;
  location: "Anteatery" | "Brandywine";
  createdAt: Timestamp | null;
}

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "buyerRequests"),
      where("status", "==", "waiting"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedBuyers: Buyer[] = snapshot.docs.map((d) => ({
        id: d.id,
        location: d.data().location,
        createdAt: d.data().createdAt ?? null,
      }));
      setBuyers(updatedBuyers);
    });

    return () => unsubscribe();
  }, []);

  const chooseBuyer = async (buyerId: string) => {
    try {
      await updateDoc(doc(db, "buyerRequests", buyerId), {
        status: "matched",
      });
      router.push("/buyer-otw");
    } catch (err) {
      console.error("Failed to match buyer:", err);
    }
  };

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <ProtectedRoute role="seller" setupAccess="requires-complete">
      <NavigationBar userRole="seller" />
      <main className="min-h-screen bg-background relative px-6 py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pt-20">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Seller Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {profile.name}. Select a buyer to continue.
            </p>
          </div>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Potential buyers</h2>
            {buyers.length === 0 && (
              <p className="text-muted-foreground">
                No buyers waiting right now.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {buyers.map((buyer) => (
                <Card
                  key={buyer.id}
                  className="flex flex-col gap-3 border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <div className="text-lg font-semibold">Guest Buyer</div>
                      <div className="text-sm text-muted-foreground">
                        Location: {buyer.location}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requested: {getTimeAgo(buyer.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button
                    className="sm:self-center"
                    onClick={() => chooseBuyer(buyer.id)}
                  >
                    Choose buyer
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
