"use client";

import { useCallback, useEffect, useState } from "react";
import useApi from "./useApi";

export interface Payment {
  id: number;
  amount: number;
  status: string;
  payment_date: string;
  receipt_id: string | null;
  subscription: {
    description: string;
    status: string;
  };
}

export interface Subscription {
  id: number;
  description: string;
  status: string;
  plan_id: string;
  amount: number;
  quantity: number;
  next_billing_date: string | null;
}

interface BillingData {
  payments: Payment[];
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBillingData(): BillingData {
  const paymentsApi = useApi<Payment[]>();
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const fetchBillingData = useCallback(async () => {
    try {
      const payments = await paymentsApi.request("/payments");

      // Typically we would have a separate endpoint for active subscription
      // For this demo, we'll just use the most recent payment's subscription details
      if (payments && payments.length > 0) {
        // This is a simplified approach - in a real app, you'd have a dedicated endpoint
        const mostRecentPayment = payments[0];
        setSubscription({
          id: 1, // This would come from the API in a real implementation
          description: mostRecentPayment.subscription.description,
          status: mostRecentPayment.subscription.status,
          plan_id: mostRecentPayment.subscription.description.includes(
            "Premium"
          )
            ? process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID ||
              "premium-plan-id"
            : process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID || "basic-plan-id",
          amount: mostRecentPayment.amount,
          quantity: 1,
          next_billing_date: new Date(
            new Date(mostRecentPayment.payment_date).getTime() +
              30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
    }
  }, [paymentsApi]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  return {
    payments: paymentsApi.data || [],
    subscription,
    loading: paymentsApi.loading,
    error: paymentsApi.error,
    refetch: fetchBillingData,
  };
}
