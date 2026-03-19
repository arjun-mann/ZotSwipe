"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PaymentType,
  LocationPreference,
  UserRole,
  UserProfile,
} from "@/types";

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
  const PAYMENT_OPTIONS: PaymentType[] = ["Zelle", "Venmo", "Cash"];

  const isPaymentType = (value: unknown): value is PaymentType =>
    typeof value === "string" &&
    PAYMENT_OPTIONS.includes(value as PaymentType);

  const isReturningUser =
    role === "buyer"
      ? Boolean(profile?.buyerSetupComplete)
      : Boolean(profile?.sellerSetupComplete);

  // Common fields
  const [nameError, setNameError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [nameInput, setNameInput] = useState<string | undefined>(undefined);

  // Buyer-specific fields
  const [priceInput, setPriceInput] = useState<string | undefined>(undefined);
  const [priceError, setPriceError] = useState("");
  const [paymentInput, setPaymentInput] = useState<PaymentType | undefined>(
    undefined,
  );

  // Seller-specific fields
  const [locationPreference, setLocationPreference] =
    useState<LocationPreference>(
      profile?.sellerLocationPreference ?? profile?.locationPreference ?? "Either",
    );
  const [sellerPriceInput, setSellerPriceInput] = useState<string>(
    (
      profile?.sellerPricePreference ??
      profile?.pricePreference ??
      ""
    ).toString(),
  );
  const [sellerPaymentError, setSellerPaymentError] = useState("");
  const [sellerPaymentInputs, setSellerPaymentInputs] = useState<PaymentType[]>(
    (() => {
      if (Array.isArray(profile?.sellerPaymentTypes)) {
        const valid = profile.sellerPaymentTypes.filter(isPaymentType);
        if (valid.length > 0) return valid;
      }

      if (isPaymentType(profile?.sellerPaymentType)) {
        return [profile.sellerPaymentType];
      }

      if (isPaymentType(profile?.paymentType)) {
        return [profile.paymentType];
      }

      return ["Zelle"];
    })(),
  );

  // Computed values
  const name = nameInput ?? profile?.name ?? "";
  const buyerPrice =
    priceInput ?? profile?.buyerPricePreference?.toString() ?? "0";
  const buyerPayment = paymentInput ?? profile?.buyerPaymentType ?? "Zelle";

  const updatePriceError = (price: string): boolean => {
    if (!price.trim()) {
      setPriceError("Price is required!");
      return true;
    }

    if (Number(price) < 0) {
      setPriceError("Price can't be negative!");
      return true;
    }

    setPriceError("");
    return false;
  };

  const handleSave = async () => {
    setSaveError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required!");
      return;
    }

    if (role === "buyer") {
      if (updatePriceError(buyerPrice)) return;

      try {
        await updateDoc(doc(db, "users", userId), {
          name: trimmedName,
          buyerPricePreference: Number(buyerPrice),
          buyerPaymentType: buyerPayment,
          buyerSetupComplete: true,
        });

        router.push("/buyer-dashboard");
      } catch (err) {
        console.error("Failed to save buyer setup:", err);
        setSaveError("We could not save your settings. Please try again.");
      }
    } else {
      if (!locationPreference) {
        return;
      }

      if (updatePriceError(sellerPriceInput)) return;
      if (sellerPaymentInputs.length === 0) {
        setSellerPaymentError("Select at least one payment type.");
        return;
      }

      try {
        await updateDoc(doc(db, "users", userId), {
          name: trimmedName,
          // Preferred canonical fields
          sellerLocationPreference: locationPreference,
          sellerPricePreference: Number(sellerPriceInput),
          sellerPaymentType: sellerPaymentInputs[0], // legacy compatibility
          sellerPaymentTypes: sellerPaymentInputs,
          sellerSetupComplete: true,
          // Legacy keys retained for backward compatibility with older readers
          locationPreference,
          pricePreference: Number(sellerPriceInput),
          paymentType: sellerPaymentInputs[0],
        });

        router.push("/seller-dashboard");
      } catch (err) {
        console.error("Failed to save seller setup:", err);
        setSaveError("We could not save your settings. Please try again.");
      }
    }
  };

  const roleLabel = role === "buyer" ? "Buyer" : "Seller";

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-6 p-4 pt-24">
      <NavigationBar
        userRole={role}
        showSettings={false}
        showDashboard={true}
      />
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
              onInput={() => setPriceError("")}
              required
            />
            {priceError && <p className="text-sm text-red-500">{priceError}</p>}
          </div>

          {role === "buyer" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Preferred Payment Type
              </label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={buyerPayment}
                onChange={(e) =>
                  setPaymentInput(e.target.value as PaymentType)
                }
              >
                <option value="Zelle">Zelle</option>
                <option value="Venmo">Venmo</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Accepted Payment Types
              </label>
              <div className="space-y-2 rounded-md border border-input p-3">
                {PAYMENT_OPTIONS.map((paymentOption) => {
                  const checked = sellerPaymentInputs.includes(paymentOption);
                  return (
                    <label
                      key={paymentOption}
                      className="flex items-center gap-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSellerPaymentError("");
                          setSellerPaymentInputs((prev) => {
                            if (prev.includes(paymentOption)) {
                              return prev.filter((value) => value !== paymentOption);
                            }
                            return [...prev, paymentOption];
                          });
                        }}
                      />
                      {paymentOption}
                    </label>
                  );
                })}
              </div>
              {sellerPaymentError && (
                <p className="text-sm text-red-500">{sellerPaymentError}</p>
              )}
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            {isReturningUser ? "Save settings" : "Continue"}
          </Button>
          {saveError && <p className="text-sm text-red-500">{saveError}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
