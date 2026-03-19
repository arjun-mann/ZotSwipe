"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { BuyerRequestPaymentType } from "@/types";

export default function WaitingPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [dots, setDots] = useState(1);
  const [matchFound, setMatchFound] = useState(false);
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "unknown";
  const paymentTypeParam = searchParams.get("paymentType");
  const maxPriceParam = searchParams.get("maxPrice");
  const requestDocId = useRef<string | null>(null);
  const userId = user?.uid;

  const requestPaymentType: BuyerRequestPaymentType =
    paymentTypeParam === "Zelle" ||
    paymentTypeParam === "Venmo" ||
    paymentTypeParam === "Cash" ||
    paymentTypeParam === "Any"
      ? paymentTypeParam
      : "Any";
  const requestMaxPrice = (() => {
    const rawValue = Number(maxPriceParam);
    if (!Number.isFinite(rawValue)) return 0;
    if (rawValue < 0) return 0;
    return Math.floor(rawValue);
  })();

  {
    /* Made interval 500 but feel free to adjust */
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userId || profileLoading) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const createRequest = async () => {
      // Apparently React strict mode causes it to run twice
      if (requestDocId.current) return;

      try {
        const docRef = await addDoc(collection(db, "buyerRequests"), {
          location,
          status: "waiting",
          createdAt: serverTimestamp(),
          buyerId: userId,
          buyerName:
            typeof profile?.name === "string" && profile.name.trim()
              ? profile.name.trim()
              : "Guest User",
          average_travel_time: Number(profile?.average_travel_time ?? 0),
          swipes_used: Number(profile?.swipes_used ?? 0),
          paymentType: requestPaymentType,
          maxPrice: requestMaxPrice,
        });

        if (cancelled) {
          deleteDoc(doc(db, "buyerRequests", docRef.id)).catch(console.error);
          return;
        }

        requestDocId.current = docRef.id;

        unsubscribe = onSnapshot(
          doc(db, "buyerRequests", docRef.id),
          (snap) => {
            const data = snap.data();
            if (data?.status === "matched") {
              setMatchFound(true);
            }
          },
        );
      } catch (err) {
        console.error("Failed to create buyer request:", err);
      }
    };

    createRequest();

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (requestDocId.current) {
        deleteDoc(doc(db, "buyerRequests", requestDocId.current)).catch(
          console.error,
        );
        requestDocId.current = null;
      }
    };
  }, [
    location,
    profileLoading,
    profile?.name,
    profile?.average_travel_time,
    profile?.swipes_used,
    requestPaymentType,
    requestMaxPrice,
    userId,
  ]);

  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <NavigationBar userRole="buyer" showSettings={false} />
      <main className="min-h-screen bg-background relative flex flex-col">
        <div className="pt-24 pb-4">
          <h2 className="text-3xl font-semibold text-foreground text-center capitalize">
            {location}
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-8">
            {!matchFound ? (
              <>
                <h1 className="text-5xl font-bold text-foreground">
                  Waiting for seller{".".repeat(dots)}
                </h1>
                <p className="text-3xl text-muted-foreground">
                  {/*We should change this to be dynamic somehow*/}
                  ETA: 5 minutes
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl font-bold text-foreground">
                  Match found!
                </h1>
                <p className="text-3xl text-muted-foreground">
                  Please head over to the entrance of{" "}
                  <span className="capitalize font-semibold">{location}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
