"use client";

import { useEffect, useRef, useState } from "react";
import useApi from "../hooks/useApi";
import { useRouter } from "next/navigation";

interface PaypalSubscriptionButtonProps {
  planId: string;
  description: string;
  amount: number;
}

// Define types for PayPal SDK
interface PayPalNamespace {
  Buttons: (config: PayPalButtonConfig) => {
    render: (element: HTMLElement) => void;
  };
}

interface PayPalButtonConfig {
  style: {
    layout: string;
    color: string;
    shape: string;
    label: string;
  };
  createSubscription: (
    data: unknown,
    actions: PayPalActions
  ) => Promise<string>;
  onApprove: (data: PayPalApproveData) => Promise<void>;
  onError: (err: Error) => void;
}

interface PayPalActions {
  subscription: {
    create: (params: { plan_id: string }) => Promise<string>;
  };
}

interface PayPalApproveData {
  subscriptionID: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

export default function PaypalSubscriptionButton({
  planId,
  description,
  amount,
}: PaypalSubscriptionButtonProps) {
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    // Load the PayPal script if it hasn't been loaded already
    if (!window.paypal) {
      const script = document.createElement("script");
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

      if (!clientId) {
        setError("PayPal client ID is not configured");
        return;
      }

      // Use the environment-specific URL and your actual client ID
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;

      // For sandbox testing, use this instead:
      // script.src =
      //   `https://www.sandbox.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;

      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setError("Failed to load PayPal SDK");
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Initialize the PayPal button once the script is loaded
    if (scriptLoaded && paypalButtonRef.current && window.paypal) {
      // Clear any existing buttons
      paypalButtonRef.current.innerHTML = "";

      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "subscribe",
          },
          createSubscription: (data: unknown, actions: PayPalActions) => {
            return actions.subscription.create({
              plan_id: planId,
            });
          },
          onApprove: async (data: PayPalApproveData) => {
            try {
              const subscriptionId = data.subscriptionID;

              // Send the subscription data to our backend
              await api.request("/company_subscription", {
                method: "POST",
                body: {
                  subscription: {
                    paypal_subscription_id: subscriptionId,
                    plan_id: planId,
                    description,
                    payment_date: new Date().toISOString(),
                    status: "ACTIVE",
                    quantity: 1,
                    amount,
                  },
                },
              });

              // Redirect to the billing page
              router.push("/billing");
            } catch (error) {
              setError("Failed to process subscription. Please try again.");
              console.error("Subscription processing error:", error);
            }
          },
          onError: (err: Error) => {
            setError("An error occurred with PayPal. Please try again.");
            console.error("PayPal error:", err);
          },
        })
        .render(paypalButtonRef.current);
    }
  }, [scriptLoaded, planId, description, amount, api, router]);

  return (
    <div className="w-full">
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}
      <div ref={paypalButtonRef} className="w-full">
        {!scriptLoaded && (
          <div className="p-3 text-center border rounded">
            Loading PayPal...
          </div>
        )}
      </div>
    </div>
  );
}
