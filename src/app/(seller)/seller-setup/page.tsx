"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSellerRedirect } from "@/hooks/useSellerRedirect";

export default function SellerSetup() {
  const router = useRouter();
  const { user, authLoading, profileLoading } = useSellerRedirect("setup");
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (!user || !name) return;
    await updateDoc(doc(db, "users", user.uid), { name });
    router.push("/seller-dashboard");
  };

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Seller Setup</h1>
      <div className="text-lg">Welcome, {user.email}!</div>
      <div className="flex flex-col gap-4 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold">Enter Your Name</h1>
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSave}>Continue</Button>
      </div>
      <SignOutButton />
    </div>
  );
}
