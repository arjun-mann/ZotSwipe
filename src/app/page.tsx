"use client";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavigationBar showSettings={false} showSignOut={false} showSignIn={true} />
      <main className="min-h-screen bg-background relative">
      
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 pt-20">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-foreground">
            Welcome to ZotSwipe
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your premier guest swipe coordinator for UCI dining halls!
          </p>
        </div>
        
        <Link href="/signin-page">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
        </div>
      </main>
    </>
  );
}
