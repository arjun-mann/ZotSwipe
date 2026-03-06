"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

type LocationPreference = "Anteatery" | "Brandywine" | "Either";
type PaymentType = "Zelle" | "Venmo" | "Cash";

export default function SellerSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const [nameError, setNameError] = useState("");
  const [nameInput, setNameInput] = useState<string | undefined>(undefined);
  const [locationInput, setLocationInput] = useState<
    LocationPreference | undefined
  >(undefined);
  const [priceInput, setPriceInput] = useState<number | undefined>(undefined);
  const [paymentInput, setPaymentInput] = useState<PaymentType | undefined>(
    undefined,
  );

  const name = nameInput ?? profile?.name ?? "";
  const locationPreference =
    locationInput ?? profile?.sellerLocationPreference ?? "Either";
  const pricePreference = priceInput ?? profile?.sellerPricePreference ?? 0;
  const paymentType = paymentInput ?? profile?.sellerPaymentType ?? "Zelle";

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required!");
      return;
    }

    if (!user || pricePreference < 0) return;

    await updateDoc(doc(db, "users", user.uid), {
      name: trimmedName,
      sellerLocationPreference: locationPreference,
      sellerPricePreference: pricePreference,
      sellerPaymentType: paymentType,
      sellerSetupComplete: true,
    });

    router.push("/seller-dashboard");
  };

  const isReturningUser = Boolean(profile?.sellerSetupComplete);

  return (
    <ProtectedRoute role="seller" setupAccess="any">
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            {isReturningUser ? "Seller Settings" : "Seller Setup"}
          </h1>
          {user?.email && (
            <p className="text-muted-foreground">Welcome, {user.email}!</p>
          )}
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {isReturningUser
                ? "Update Your Preferences"
                : "Complete Your Profile"}
            </CardTitle>
            <CardDescription>
              {isReturningUser
                ? "Change your seller settings anytime"
                : "Enter your preferences to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setNameError("");
                }}
                required
              />
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location Preference</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={locationPreference}
                onChange={(e) =>
                  setLocationInput(e.target.value as LocationPreference)
                }
              >
                <option value="Anteatery">Anteatery</option>
                <option value="Brandywine">Brandywine</option>
                <option value="Either">Either</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Per Swipe ($)</label>
              <Input
                type="number"
                min="0"
                placeholder="Enter price"
                value={pricePreference}
                onChange={(e) => setPriceInput(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Preferred Payment Type
              </label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={paymentType}
                onChange={(e) => setPaymentInput(e.target.value as PaymentType)}
              >
                <option value="Zelle">Zelle</option>
                <option value="Venmo">Venmo</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <Button onClick={handleSave} className="w-full">
              {isReturningUser ? "Save settings" : "Continue"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex w-full max-w-md flex-col gap-3">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Back to landing page
            </Button>
          </Link>
          <SignOutButton />
        </div>
      </div>
    </ProtectedRoute>
  );
}
