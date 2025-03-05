"use client";

import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

// Define the Payment interface
interface Payment {
  id: string;
  payment_date: string;
  amount: number;
  status: string;
  receipt_id: string | null;
  subscription: {
    description: string;
  };
}

export default function BillingPage() {
  const api = useApi();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a flag to track whether we've already fetched data
  const [paymentsFetched, setPaymentsFetched] = useState(false);

  // Add a handler function for downloading receipts with proper type annotation
  const handleDownload = (receiptId: string) => {
    if (receiptId) {
      // This will construct the URL correctly with BASE_URL from your useApi hook
      window.location.href = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
      }/receipts/${receiptId}/download`;
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      // Avoid duplicate fetches
      if (paymentsFetched) return;

      try {
        setLoading(true);
        const response = await api.request("/payments");
        setPayments(response);
        setPaymentsFetched(true); // Mark that we've fetched payments
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [api]); // Remove paymentsFetched from dependency array

  if (loading) return <div className="p-4">Loading payment history...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Billing & Payment History</h1>

      {payments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p>No payment history available.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {payment.subscription.description}
                  </td>
                  <td className="px-4 py-2">${payment.amount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {payment.receipt_id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleDownload(payment.receipt_id as string)
                          }
                          className="text-green-600 hover:underline"
                        >
                          Download
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Processing...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
