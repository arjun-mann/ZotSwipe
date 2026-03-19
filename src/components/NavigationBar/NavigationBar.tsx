"use client";

import Link from "next/link";
import { Settings, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/SignOutButton/SignOutButton";

interface NavigationBarProps {
  userRole?: "buyer" | "seller";
  showSettings?: boolean;
  showDashboard?: boolean;
  showLanding?: boolean;
  showSignOut?: boolean;
  showSignIn?: boolean;
}

export default function NavigationBar({ 
  userRole, 
  showSettings = true, 
  showDashboard = false,
  showLanding = true,
  showSignOut = true,
  showSignIn = false
}: NavigationBarProps) {
  const settingsLink = userRole === "seller" ? "/seller-setup" : null;
  const dashboardLink = userRole === "buyer" ? "/buyer-dashboard" : userRole === "seller" ? "/seller-dashboard" : null;

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity">
          ZotSwipe
        </Link>
        
        <div className="flex items-center gap-4">
          {showDashboard && dashboardLink && userRole && (
            <Link href={dashboardLink} className="flex items-center gap-2 text-sm text-foreground hover:opacity-80 transition-opacity">
              <LayoutDashboard className="h-4 w-4" />
              <span className="capitalize">{userRole} Dashboard</span>
            </Link>
          )}
          {showSettings && settingsLink && userRole && (
            <Link href={settingsLink} className="flex items-center gap-2 text-sm text-foreground hover:opacity-80 transition-opacity">
              <Settings className="h-4 w-4" />
              <span className="capitalize">{userRole} Settings</span>
            </Link>
          )}
          {showLanding && userRole && (
            <Link href="/landing-page" className="flex items-center gap-2 text-sm text-foreground hover:opacity-80 transition-opacity">
              <User className="h-4 w-4" />
              <span>Switch Role</span>
            </Link>
          )}
          {showSignOut && <SignOutButton />}
          {showSignIn && (
            <Link href="/signin-page">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
