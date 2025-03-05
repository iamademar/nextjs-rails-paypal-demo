"use client";

import PaypalSubscriptionButton from "../../../components/PaypalSubscriptionButton";
import Link from "next/link";

export default function PremiumUpgradePage() {
  const planId = process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID;

  if (!planId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h1>
          <p className="mb-4">
            The Premium Plan ID is not configured. Please check your environment
            variables.
          </p>
          <Link
            href="/"
            className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-8 max-w-md w-full shadow-lg rounded-lg border">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upgrade to Premium Plan
        </h1>

        <div className="mb-8">
          <div className="mb-4 p-4 bg-indigo-50 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Premium Plan</h2>
            <p className="text-gray-600 mb-2">
              Unlimited access to all features and priority support.
            </p>
            <p className="text-2xl font-bold text-indigo-600">$199 / month</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">What&apos;s included:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>All Basic features plus:</li>
              <li>Unlimited users</li>
              <li>Priority support</li>
              <li>10 GB storage</li>
              <li>Advanced analytics</li>
              <li>Custom integrations</li>
            </ul>
          </div>
        </div>

        <PaypalSubscriptionButton
          planId={planId}
          description="Premium Plan Subscription"
          amount={199}
        />

        <div className="mt-4 text-center">
          <Link href="/" className="text-indigo-600 hover:underline">
            Cancel and return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
