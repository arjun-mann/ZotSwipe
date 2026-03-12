export type PaymentType = "Zelle" | "Venmo" | "Cash";

export type LocationPreference = "Anteatery" | "Brandywine" | "Either";

export type UserRole = "buyer" | "seller";

export interface UserProfile {
  name: string | null;
  email: string | null;
  createdAt: Date;
  buyerSetupComplete?: boolean;
  sellerSetupComplete?: boolean;
  buyerPricePreference?: number | null;
  buyerPaymentType?: PaymentType | null;
  sellerLocationPreference?: LocationPreference | null;
  sellerPricePreference?: number | null;
  sellerPaymentType?: PaymentType | null;
  average_travel_time?: number;
  swipes_used?: number;
}
