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
import { getBuyerRankScore, getTimeAgo } from "@/lib/helpers";
import { BuyerRequestPaymentType, PaymentType } from "@/types";
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
  name: string;
  location: "Anteatery" | "Brandywine";
  createdAt: Timestamp | null;
  paymentType: BuyerRequestPaymentType;
  maxPrice: number;
  averageTravelTime: number;
  swipesUsed: number;
  rankScore: number;
}

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  const [allWaitingBuyers, setAllWaitingBuyers] = useState<Buyer[]>([]);

  const sellerPaymentTypes: PaymentType[] = (() => {
    if (Array.isArray(profile?.sellerPaymentTypes)) {
      const valid = profile.sellerPaymentTypes.filter(
        (value): value is PaymentType =>
          value === "Zelle" || value === "Venmo" || value === "Cash",
      );
      if (valid.length > 0) return valid;
    }

    if (
      profile?.sellerPaymentType === "Zelle" ||
      profile?.sellerPaymentType === "Venmo" ||
      profile?.sellerPaymentType === "Cash"
    ) {
      return [profile.sellerPaymentType];
    }

    if (
      profile?.paymentType === "Zelle" ||
      profile?.paymentType === "Venmo" ||
      profile?.paymentType === "Cash"
    ) {
      return [profile.paymentType];
    }

    return [];
  })();

  const sellerPricePreference = (() => {
    const parsedPrice = Number(
      profile?.sellerPricePreference ?? profile?.pricePreference,
    );
    return Number.isFinite(parsedPrice) ? parsedPrice : Number.POSITIVE_INFINITY;
  })();

  const buyers = allWaitingBuyers
    .filter((buyer) => {
      const priceCompatible = buyer.maxPrice >= sellerPricePreference;
      const paymentCompatible =
        buyer.paymentType === "Any" ||
        sellerPaymentTypes.includes(buyer.paymentType as PaymentType);

      return priceCompatible && paymentCompatible;
    })
    .sort((a, b) => {
      const rankDelta = b.rankScore - a.rankScore;
      if (rankDelta !== 0) return rankDelta;

      const aCreatedAt = a.createdAt?.toMillis() ?? 0;
      const bCreatedAt = b.createdAt?.toMillis() ?? 0;
      return aCreatedAt - bCreatedAt;
    });

  useEffect(() => {
    const q = query(
      collection(db, "buyerRequests"),
      where("status", "==", "waiting"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedBuyers: Buyer[] = snapshot.docs.map((d) => {
        const data = d.data();

        const paymentType: BuyerRequestPaymentType =
          data.paymentType === "Zelle" ||
          data.paymentType === "Venmo" ||
          data.paymentType === "Cash" ||
          data.paymentType === "Any"
            ? data.paymentType
            : "Any";

        const maxPrice = Number(data.maxPrice);
        const averageTravelTime = Number(data.average_travel_time ?? 0);
        const swipesUsed = Number(data.swipes_used ?? 0);
        const safeAverageTravelTime = Number.isFinite(averageTravelTime)
          ? averageTravelTime
          : 0;
        const safeSwipesUsed = Number.isFinite(swipesUsed) ? swipesUsed : 0;

        return {
          id: d.id,
          name:
            typeof data.buyerName === "string" && data.buyerName.trim()
              ? data.buyerName.trim()
              : "Guest Buyer",
          location: data.location,
          createdAt: data.createdAt ?? null,
          paymentType,
          maxPrice: Number.isFinite(maxPrice) ? maxPrice : 0,
          averageTravelTime: safeAverageTravelTime,
          swipesUsed: safeSwipesUsed,
          rankScore: getBuyerRankScore(safeAverageTravelTime, safeSwipesUsed),
        };
      });
      setAllWaitingBuyers(updatedBuyers);
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
                      <div className="text-lg font-semibold">{buyer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Location: {buyer.location}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Payment: {buyer.paymentType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Max price: ${buyer.maxPrice}
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
