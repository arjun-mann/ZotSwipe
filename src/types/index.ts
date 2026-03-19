export type PaymentType = "Zelle" | "Venmo" | "Cash";
export type BuyerRequestPaymentType = PaymentType | "Any";

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
  locationPreference?: LocationPreference | null; // legacy seller field
  pricePreference?: number | null; // legacy seller field
  paymentType?: PaymentType | null; // legacy seller field
  sellerLocationPreference?: LocationPreference | null;
  sellerPricePreference?: number | null;
  sellerPaymentType?: PaymentType | null; // legacy single-value field
  sellerPaymentTypes?: PaymentType[] | null;
  average_travel_time?: number | null;
  swipes_used?: number | null;
}
