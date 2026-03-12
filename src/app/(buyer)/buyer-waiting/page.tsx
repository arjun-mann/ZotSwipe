"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";

export default function WaitingPage() {
  const { user } = useAuth();
  const userId = user?.uid;
  const router = useRouter();
  const [dots, setDots] = useState(1);
  const [matchFound, setMatchFound] = useState(false);
  const [submittingArrival, setSubmittingArrival] = useState(false);
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "unknown";
  const requestDocId = useRef<string | null>(null);
  const matchedAtMs = useRef<number | null>(null);
  const requestCompleted = useRef(false);

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
    if (!userId) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const createRequest = async () => {
      // Apparently React strict mode causes it to run twice
      if (requestDocId.current) return;

      try {
        const userProfileSnap = await getDoc(doc(db, "users", userId));
        const userProfile = userProfileSnap.data() ?? {};
        const buyerName =
          typeof userProfile.name === "string" && userProfile.name.trim()
            ? userProfile.name.trim()
            : "Guest User";
        const averageTravelTime = Number(userProfile.average_travel_time ?? 0);
        const swipesUsed = Number(userProfile.swipes_used ?? 0);

        const docRef = await addDoc(collection(db, "buyerRequests"), {
          location,
          status: "waiting",
          createdAt: serverTimestamp(),
          buyerId: userId,
          buyerName,
          average_travel_time: Number.isFinite(averageTravelTime)
            ? averageTravelTime
            : 0,
          swipes_used: Number.isFinite(swipesUsed) ? swipesUsed : 0,
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
              if (matchedAtMs.current === null) {
                matchedAtMs.current = Date.now();
              }
              setMatchFound(true);
            }

            if (data?.status === "arrived") {
              requestCompleted.current = true;
              router.push("/buyer-thanks");
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
      if (requestDocId.current && !requestCompleted.current) {
        deleteDoc(doc(db, "buyerRequests", requestDocId.current)).catch(
          console.error,
        );
      }
      requestDocId.current = null;
    };
  }, [location, router, userId]);

  const handleAtLocation = async () => {
    const requestId = requestDocId.current;
    const matchedTime = matchedAtMs.current;

    if (!user || !requestId || matchedTime === null || submittingArrival) {
      return;
    }

    setSubmittingArrival(true);
    try {
      const elapsedSeconds = Math.max(
        1,
        Math.round((Date.now() - matchedTime) / 1000),
      );
      const userRef = doc(db, "users", user.uid);
      const requestRef = doc(db, "buyerRequests", requestId);

      await runTransaction(db, async (tx) => {
        const userSnap = await tx.get(userRef);
        const userData = userSnap.data() ?? {};

        const previousAverage = Number(userData.average_travel_time ?? 0);
        const previousCount = Number(userData.swipes_used ?? 0);
        const nextCount = previousCount + 1;
        const nextAverage =
          previousCount === 0
            ? elapsedSeconds
            : (previousAverage * previousCount + elapsedSeconds) / nextCount;

        tx.set(
          userRef,
          {
            average_travel_time: nextAverage,
            swipes_used: nextCount,
          },
          { merge: true },
        );

        tx.update(requestRef, {
          status: "arrived",
          arrivedAt: serverTimestamp(),
        });
      });

      requestCompleted.current = true;
      router.push("/buyer-thanks");
    } catch (err) {
      console.error("Failed to mark buyer as arrived:", err);
    } finally {
      setSubmittingArrival(false);
    }
  };

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
                <Button
                  size="lg"
                  onClick={handleAtLocation}
                  disabled={submittingArrival}
                >
                  {submittingArrival ? "Updating..." : "At location"}
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
