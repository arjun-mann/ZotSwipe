import { Timestamp } from "firebase/firestore";
import { UserProfile } from "@/types";

/**
 * Helper function to format time ago from Firebase Timestamp
 */
export function getTimeAgo(timestamp: Timestamp | null): string {
  if (!timestamp) return "just now";
  const diff = Math.floor((Date.now() - timestamp.toMillis()) / 60000);
  if (diff < 1) return "just now";
  return `${diff} min${diff === 1 ? "" : "s"} ago`;
}

/**
 * Helper function to check if setup is complete for a specific role
 */
export function isSetupComplete(
  role: "buyer" | "seller",
  profile: UserProfile | null
): boolean {
  if (!profile) return false;

  if (role === "buyer") {
    return Boolean(profile.buyerSetupComplete ?? profile.name);
  }

  return Boolean(profile.sellerSetupComplete ?? profile.name);
}
