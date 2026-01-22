/**
 * Payment Types
 *
 * Type definitions for the Stripe payment integration.
 */

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'refunded'
  | 'disputed';

export type ProductType = 'relomatch_report' | 'consultation';

export interface Payment {
  id: string;
  userId: string;
  questionnaireResponseId: string | null;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  productType: ProductType;
  productName: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  refundedAt: string | null;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentStatusResponse {
  hasPaid: boolean;
}

export interface PaymentsListResponse {
  payments: Payment[];
  total: number;
}

export interface StripeConfigResponse {
  publishableKey: string;
}

export interface CreateCheckoutParams {
  productType: ProductType;
  questionnaireResponseId?: string;
  successUrl?: string;
  cancelUrl?: string;
}
