"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { UserProfile } from "@/types";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!user) {
        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
      }

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
