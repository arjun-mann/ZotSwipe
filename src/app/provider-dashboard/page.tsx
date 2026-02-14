"use client";

import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProviderRedirect } from "@/hooks/useProviderRedirect";

interface Buyer {
  id: string;
  name: string;
  location: "Anteatery" | "Brandywine";
  requestedMinsAgo: number;
}

export default function ProviderDashboard() {
  const { user, profile, authLoading, profileLoading } =
    useProviderRedirect("dashboard");
  const router = useRouter();

  // TODO: replace with real data from backend/database
  const buyers: Buyer[] = [
    {
      id: "buyer-1",
      name: "Abhi S",
      location: "Brandywine",
      requestedMinsAgo: 1,
    },
    {
      id: "buyer-2",
      name: "Jordan R",
      location: "Anteatery",
      requestedMinsAgo: 5,
    },
    {
      id: "buyer-3",
      name: "Priya K",
      location: "Brandywine",
      requestedMinsAgo: 8,
    },
  ];

  // TODO: is this the correct page to redirect to?
  const chooseBuyer = () => {
    router.push("/buyer-otw");
  };

  if (authLoading || profileLoading) {
    return <LoadingPage />;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {profile.name}. Select a buyer to continue.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Potential buyers</h2>
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
                      Requested: {buyer.requestedMinsAgo} min
                      {buyer.requestedMinsAgo === 1 ? "" : "s"} ago
                    </div>
                  </div>
                </div>
                <Button className="sm:self-center" onClick={chooseBuyer}>
                  Choose buyer
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
