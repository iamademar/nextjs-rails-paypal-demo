// Hook for making API calls
import { useState, useCallback } from "react";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: ApiMethod;
  body?: object;
  headers?: Record<string, string>;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (endpoint: string, options: ApiOptions = {}) => {
      const { method = "GET", body, headers = {} } = options;

      // Set some default headers
      const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // Set loading state
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        // Make the request
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers: { ...defaultHeaders, ...headers },
          body: body ? JSON.stringify(body) : undefined,
        });

        // Check if the response is ok
        if (!response.ok) {
          // Try to get error details from the response if available
          let errorMessage = `Request failed with status ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If we can't parse the error response, just use the default message
          }
          throw new Error(errorMessage);
        }

        // Parse the response
        const data = await response.json();

        // Update the state with the data
        setState({
          data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        // Update the state with the error
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    },
    []
  );

  return {
    ...state,
    request,
  };
}

export default useApi;
