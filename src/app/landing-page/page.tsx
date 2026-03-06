"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background relative flex flex-col">
      <div className="pt-12 pb-8">
        <h1 className="text-6xl font-bold text-foreground text-center">
          ZotSwipe
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 pb-16">
        <div className="flex gap-8 flex-col sm:flex-row w-full max-w-7xl">
          <Link href="/buyer-dashboard" className="flex-1">
            <Button variant="outline" size="lg">
              I&apos;m a Buyer
            </Button>
          </Link>
          <Link href="/seller-dashboard" className="flex-1">
            <Button variant="outline" size="lg">
              I&apos;m a Seller
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
