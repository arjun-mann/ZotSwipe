"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

interface UserProfile {
  name: string | null;
  email: string | null;
  createdAt: Date;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const userRef = doc(
        db,
        "users",
        user.uid,
      ) as DocumentReference<UserProfile>;
      const snap = await getDoc(userRef);

      setProfile(snap.data() ?? null);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
}
