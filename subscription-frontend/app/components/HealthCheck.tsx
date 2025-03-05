"use client";

import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";

interface HealthResponse {
  status: string;
  message: string;
}

export default function HealthCheck() {
  const { data, loading, error, request } = useApi<HealthResponse>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await request("/health");
        setInitialized(true);
      } catch (err) {
        console.error("Failed to check API health:", err);
        setInitialized(true);
      }
    };

    checkHealth();
  }, [request]);

  if (!initialized || loading) {
    return (
      <div className="p-4 border rounded shadow-sm">
        Checking API connection...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded shadow-sm">
        <h3 className="font-bold">API Connection Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-green-300 bg-green-50 text-green-800 rounded shadow-sm">
      <h3 className="font-bold">API Connection Status</h3>
      <p>Status: {data?.status}</p>
      <p>Message: {data?.message}</p>
    </div>
  );
}
