"use client";

import PaypalSubscriptionButton from "../../../components/PaypalSubscriptionButton";
import Link from "next/link";
import { useEffect } from "react";

export default function BasicUpgradePage() {
  const planId = process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID;

  if (!planId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h1>
          <p className="mb-4">
            The Basic Plan ID is not configured. Please check your environment
            variables.
          </p>
          <Link
            href="/"
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-center"
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
          Upgrade to Basic Plan
        </h1>

        <div className="mb-8">
          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Basic Plan</h2>
            <p className="text-gray-600 mb-2">
              Access to core features with limited usage.
            </p>
            <p className="text-2xl font-bold text-blue-600">$139 / month</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">What&apos;s included:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Basic feature access</li>
              <li>Up to 100 users</li>
              <li>Email support</li>
              <li>1 GB storage</li>
            </ul>
          </div>
        </div>

        <PaypalSubscriptionButton
          planId={planId}
          description="Basic Plan Subscription"
          amount={139}
        />

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Cancel and return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
