"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuyerRequestPaymentType } from "@/types";

export default function LandingPage() {
  const router = useRouter();
  const [requestPaymentType, setRequestPaymentType] =
    useState<BuyerRequestPaymentType | "">("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const maxPriceValue = Number(maxPriceInput);
  const isMaxPriceValid =
    maxPriceInput.trim() !== "" &&
    Number.isInteger(maxPriceValue) &&
    maxPriceValue >= 0;
  const canSelectDiningHall = Boolean(requestPaymentType) && isMaxPriceValid;

  const goToWaitingPage = (location: "Anteatery" | "Brandywine") => {
    if (!canSelectDiningHall) return;

    const query = new URLSearchParams({
      location,
      paymentType: requestPaymentType,
      maxPrice: String(maxPriceValue),
    });
    router.push(`/buyer-waiting?${query.toString()}`);
  };

  return (
    <ProtectedRoute role="buyer" setupAccess="requires-complete">
      <NavigationBar userRole="buyer" />
      <main className="min-h-screen bg-background relative flex flex-col">
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-7xl space-y-8">
            <div className="mx-auto max-w-3xl rounded-xl border border-border p-6">
              <h2 className="text-2xl font-semibold">Before you request</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Set your payment preference and max price first.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Type</label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3"
                    value={requestPaymentType}
                    onChange={(e) =>
                      setRequestPaymentType(
                        e.target.value as BuyerRequestPaymentType | "",
                      )
                    }
                  >
                    <option value="" disabled>
                      Select payment
                    </option>
                    <option value="Zelle">Zelle</option>
                    <option value="Venmo">Venmo</option>
                    <option value="Cash">Cash</option>
                    <option value="Any">Any</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter max price"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {!canSelectDiningHall && (
              <p className="text-center text-sm text-muted-foreground">
                Select payment type and enter a valid max price to continue.
              </p>
            )}

            <div className="flex gap-8 flex-col sm:flex-row">
              <Button
                size="lg"
                disabled={!canSelectDiningHall}
                onClick={() => goToWaitingPage("Anteatery")}
                className="w-full flex-1 text-6xl sm:text-7xl md:text-8xl py-32 sm:py-40 h-auto font-bold hover:scale-[1.02] transition-transform"
              >
                Anteatery
              </Button>
              <Button
                variant="secondary"
                size="lg"
                disabled={!canSelectDiningHall}
                onClick={() => goToWaitingPage("Brandywine")}
                className="w-full flex-1 text-6xl sm:text-7xl md:text-8xl py-32 sm:py-40 h-auto font-bold hover:scale-[1.02] transition-transform"
              >
                Brandywine
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
