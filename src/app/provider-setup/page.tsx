"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProviderRedirect } from "@/hooks/useProviderRedirect";

type LocationPreference = "Anteatery" | "Brandywine" | "Either";
type PaymentType = "Zelle" | "Venmo" | "Cash";

export default function ProviderSetup() {
  const router = useRouter();
  const { user, authLoading, profileLoading } = useProviderRedirect("setup");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [locationPreference, setLocationPreference] =
    useState<LocationPreference>("Either");
  const [pricePreference, setPricePreference] = useState(0);
  const [paymentType, setPaymentType] = useState<PaymentType>("Zelle");

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Name is required!");
      return;
    }

    if (!user || !locationPreference || pricePreference < 0 || !paymentType)
      return;

    await updateDoc(doc(db, "users", user.uid), {
      name,
      locationPreference,
      pricePreference,
      paymentType,
    });

    router.push("/provider-dashboard");
  };

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Provider Setup</h1>
        <p className="text-muted-foreground">Welcome, {user.email}!</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Enter your preferences to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              required
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location Preference</label>
            <Select
              value={locationPreference}
              onValueChange={(value) =>
                setLocationPreference(value as LocationPreference)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anteatery">Anteatery</SelectItem>
                <SelectItem value="Brandywine">Brandywine</SelectItem>
                <SelectItem value="Either">Either</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Per Swipe ($)</label>
            <Input
              type="number"
              min="0"
              placeholder="Enter price"
              value={pricePreference}
              onChange={(e) => setPricePreference(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Preferred Payment Type
            </label>
            <Select
              value={paymentType}
              onValueChange={(value) => setPaymentType(value as PaymentType)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zelle">Zelle</SelectItem>
                <SelectItem value="Venmo">Venmo</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>

      <SignOutButton />
    </div>
  );
}
