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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Ranking score for buyers.
 * A (average_travel_time): 0-900 seconds, lower is better, weight 0.4
 * B (swipes_used): 0-20, higher is better, weight 0.6
 */
export function getBuyerRankScore(
  averageTravelTime: number,
  swipesUsed: number
): number {
  const A_MIN = 0;
  const A_MAX = 15 * 60;
  const B_MIN = 0;
  const B_MAX = 20;

  const normalizedA =
    (A_MAX - clamp(averageTravelTime, A_MIN, A_MAX)) / (A_MAX - A_MIN);
  const normalizedB =
    (clamp(swipesUsed, B_MIN, B_MAX) - B_MIN) / (B_MAX - B_MIN);

  return 0.4 * normalizedA + 0.6 * normalizedB;
}
