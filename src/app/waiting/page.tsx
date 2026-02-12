"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WaitingPage() {
  const [dots, setDots] = useState(1);
  const [matchFound, setMatchFound] = useState(false);
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "unknown";

  {/* Made interval 500 but feel free to adjust */}
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  {/* Use effect cuz I only know this hook */}
  useEffect(() => {
    const timer = setTimeout(() => {
      setMatchFound(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background relative flex flex-col">
      <div className="pt-8 pb-4">
        <h2 className="text-3xl font-semibold text-foreground text-center capitalize">
          {location}
        </h2>
      </div>

      {!matchFound && (
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button variant="destructive" size="lg" className="hover:ring-4 hover:ring-destructive/30">
              Cancel Request
            </Button>
          </Link>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8">
          {!matchFound ? (
            <>
              <h1 className="text-5xl font-bold text-foreground">
                Waiting for seller{".".repeat(dots)}
              </h1>
              <p className="text-3xl text-muted-foreground">
                {/*We should change this to be dynamic somehow*/}
                ETA: 5 minutes
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-foreground">
                Match found!
              </h1>
              <p className="text-3xl text-muted-foreground">
                Please head over to the entrance of <span className="capitalize font-semibold">{location}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
