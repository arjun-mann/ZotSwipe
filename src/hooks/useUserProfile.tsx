"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export interface UserProfile {
  name: string | null;
  email: string | null;
  createdAt: Date;
  buyerSetupComplete?: boolean;
  sellerSetupComplete?: boolean;
  buyerPricePreference?: number | null;
  buyerPaymentType?: "zelle" | "venmo" | "cash" | null;
  sellerLocationPreference?: "Anteatery" | "Brandywine" | "Either" | null;
  sellerPricePreference?: number | null;
  sellerPaymentType?: "zelle" | "venmo" | "cash" | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;

    const fetchProfile = async () => {
      const userRef = doc(
        db,
        "users",
        user.uid,
      ) as DocumentReference<UserProfile>;
      const snap = await getDoc(userRef);

      if (cancelled) return;

      setProfile(snap.data() ?? null);
      setLoading(false);
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, loading };
}
