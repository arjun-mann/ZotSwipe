"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import LoadingPage from "@/components/LoadingPage/LoadingPage";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function LandingPage() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();

  const goToBuyerFlow = () => {
    const setupComplete = Boolean(profile?.buyerSetupComplete ?? profile?.name);
    router.push(setupComplete ? "/buyer-dashboard" : "/buyer-setup");
  };

  const goToSellerFlow = () => {
    const setupComplete = Boolean(
      profile?.sellerSetupComplete ?? profile?.name,
    );
    router.push(setupComplete ? "/seller-dashboard" : "/seller-setup");
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ProtectedRoute>
      <NavigationBar showSettings={false} showLanding={false} />
      <main className="min-h-screen bg-background relative flex flex-col">
        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <div className="flex gap-8 flex-col sm:flex-row w-full max-w-7xl">
            <Button
              size="lg"
              className="w-full flex-1 text-6xl sm:text-7xl md:text-8xl py-32 sm:py-40 h-auto font-bold hover:scale-[1.02] transition-transform"
              onClick={goToBuyerFlow}
            >
              Buyer
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full flex-1 text-6xl sm:text-7xl md:text-8xl py-32 sm:py-40 h-auto font-bold hover:scale-[1.02] transition-transform"
              onClick={goToSellerFlow}
            >
              Seller
            </Button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
