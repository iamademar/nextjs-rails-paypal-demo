import { renderHook, act } from "@testing-library/react";
import useApi from "../useApi";

describe("useApi hook", () => {
  // Mock fetch globally before tests
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset the fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Restore the original fetch after each test
    global.fetch = originalFetch;
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useApi());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.request).toBe("function");
  });

  test("should handle successful GET request", async () => {
    const mockResponse = { data: "test data" };

    // Mock the fetch implementation to return a successful response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useApi<{ data: string }>());

    await act(async () => {
      const response = await result.current.request("/test");
      expect(response).toEqual(mockResponse);
    });

    // Check the hook state
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/test",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      })
    );
  });

  test("should handle network errors", async () => {
    const errorMessage = "Network error";

    // Mock the fetch implementation to simulate a network error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useApi());

    // Execute the request and catch the error
    await act(async () => {
      try {
        await result.current.request("/test");
      } catch (error) {
        // We expect this to throw
      }
    });

    // Check the hook state after failure
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  test("should handle API errors with error response", async () => {
    const errorResponse = { error: "Invalid request" };

    // Mock the fetch implementation to return an error response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useApi());

    // Execute the request and catch the error
    await act(async () => {
      try {
        await result.current.request("/test");
      } catch (error) {
        // We expect this to throw
      }
    });

    // Check the hook state after failure
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorResponse.error);
  });

  test("should set loading state during request", async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: any) => void;
    const responsePromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Mock fetch to return our controlled promise
    global.fetch = jest.fn().mockImplementation(() => responsePromise);

    const { result } = renderHook(() => useApi());

    // Start the request and properly await the act
    let requestPromise: Promise<any>;
    await act(async () => {
      requestPromise = result.current.request("/test");
      // Allow React to process the state update
    });

    // Check that loading state is true during the request
    expect(result.current.loading).toBe(true);

    // Now resolve the fetch promise
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      await requestPromise;
    });

    // Check that loading state is reset after the request
    expect(result.current.loading).toBe(false);
  });
});
