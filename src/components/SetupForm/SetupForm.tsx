"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";

import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { UserProfile } from "@/hooks/useUserProfile";

type PaymentType = "Zelle" | "Venmo" | "Cash";
type LocationPreference = "Anteatery" | "Brandywine" | "Either";
type UserRole = "buyer" | "seller";

interface SetupFormProps {
  role: UserRole;
  userId: string;
  userEmail?: string | null;
  profile?: UserProfile | null;
}

export default function SetupForm({
  role,
  userId,
  userEmail,
  profile,
}: SetupFormProps) {
  const router = useRouter();

  const isReturningUser =
    role === "buyer"
      ? Boolean(profile?.buyerSetupComplete)
      : Boolean(profile?.sellerSetupComplete);

  // Common fields
  const [nameError, setNameError] = useState("");
  const [nameInput, setNameInput] = useState<string | undefined>(undefined);

  // Buyer-specific fields
  const [priceInput, setPriceInput] = useState<string | undefined>(undefined);
  const [paymentInput, setPaymentInput] = useState<PaymentType | undefined>(
    undefined,
  );

  // Seller-specific fields
  const [locationPreference, setLocationPreference] =
    useState<LocationPreference>(
      (profile?.sellerLocationPreference as LocationPreference) ?? "Either",
    );
  const [sellerPriceInput, setSellerPriceInput] = useState<string>(
    profile?.sellerPricePreference?.toString() ?? "",
  );
  const [sellerPaymentInput, setSellerPaymentInput] = useState<PaymentType>(
    (profile?.sellerPaymentType as PaymentType) ?? "zelle",
  );

  // Computed values
  const name = nameInput ?? profile?.name ?? "";
  const buyerPrice =
    priceInput ?? profile?.buyerPricePreference?.toString() ?? "0";
  const buyerPayment =
    paymentInput ?? (profile?.buyerPaymentType as PaymentType) ?? "Zelle";

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required!");
      return;
    }

    if (role === "buyer") {
      if (!buyerPrice || Number(buyerPrice) < 0) return;

      await updateDoc(doc(db, "users", userId), {
        name: trimmedName,
        buyerPricePreference: Number(buyerPrice),
        buyerPaymentType: buyerPayment,
        buyerSetupComplete: true,
      });

      router.push("/buyer-dashboard");
    } else {
      if (
        !locationPreference ||
        !sellerPriceInput ||
        Number(sellerPriceInput) < 0 ||
        !sellerPaymentInput
      ) {
        return;
      }

      await updateDoc(doc(db, "users", userId), {
        name: trimmedName,
        sellerLocationPreference: locationPreference,
        sellerPricePreference: Number(sellerPriceInput),
        sellerPaymentType: sellerPaymentInput,
        sellerSetupComplete: true,
      });

      router.push("/seller-dashboard");
    }
  };

  const roleLabel = role === "buyer" ? "Buyer" : "Seller";
  const dashboardLink =
    role === "buyer" ? "/buyer-dashboard" : "/seller-dashboard";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          {isReturningUser ? `${roleLabel} Settings` : `${roleLabel} Setup`}
        </h1>
        {userEmail && (
          <p className="text-muted-foreground">Welcome, {userEmail}!</p>
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
              ? `Change your ${role} settings anytime`
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

          {role === "seller" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Location Preference</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={locationPreference}
                onChange={(e) =>
                  setLocationPreference(e.target.value as LocationPreference)
                }
                required
              >
                <option value="Anteatery">Anteatery</option>
                <option value="Brandywine">Brandywine</option>
                <option value="Either">Either</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Per Swipe ($)</label>
            <Input
              type="number"
              min="0"
              placeholder="Enter price"
              value={role === "buyer" ? buyerPrice : sellerPriceInput}
              onChange={(e) =>
                role === "buyer"
                  ? setPriceInput(e.target.value)
                  : setSellerPriceInput(e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Preferred Payment Type
            </label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3"
              value={role === "buyer" ? buyerPayment : sellerPaymentInput}
              onChange={(e) =>
                role === "buyer"
                  ? setPaymentInput(e.target.value as PaymentType)
                  : setSellerPaymentInput(e.target.value as PaymentType)
              }
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
        {isReturningUser && (
          <Link href={dashboardLink} className="w-full">
            <Button variant="outline" className="w-full">
              Back to dashboard
            </Button>
          </Link>
        )}
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full">
            Back to landing page
          </Button>
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
