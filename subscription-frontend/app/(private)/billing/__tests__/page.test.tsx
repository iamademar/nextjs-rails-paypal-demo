import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import BillingPage from "../page";
import useApi from "../../../hooks/useApi";

// Mock the useApi hook
jest.mock("../../../hooks/useApi", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock environment variable
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv };
  process.env.NEXT_PUBLIC_API_URL = "http://test-api.com/api";
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

// Mock window.location for receipt downloading
const mockAssign = jest.fn();
Object.defineProperty(window, "location", {
  value: { href: jest.fn() },
  writable: true,
});

describe("BillingPage", () => {
  // Test data
  const mockPayments = [
    {
      id: "payment-1",
      payment_date: "2023-10-15T00:00:00Z",
      amount: 99.99,
      status: "COMPLETED",
      receipt_id: "receipt-123",
      subscription: {
        description: "Premium Plan",
      },
    },
    {
      id: "payment-2",
      payment_date: "2023-09-15T00:00:00Z",
      amount: 99.99,
      status: "PENDING",
      receipt_id: null,
      subscription: {
        description: "Premium Plan",
      },
    },
    {
      id: "payment-3",
      payment_date: "2023-08-15T00:00:00Z",
      amount: 99.99,
      status: "FAILED",
      receipt_id: null,
      subscription: {
        description: "Premium Plan",
      },
    },
  ];

  test("renders loading state correctly", async () => {
    // Mock the API hook to simulate loading state with a promise that doesn't resolve immediately
    const mockRequest = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        // This promise won't resolve during the test
        setTimeout(() => resolve([]), 10000);
      });
    });

    (useApi as jest.Mock).mockReturnValue({
      request: mockRequest,
    });

    render(<BillingPage />);

    // This should be immediately visible
    expect(screen.getByText("Loading payment history...")).toBeInTheDocument();
  });

  test("renders error state correctly", async () => {
    // Temporarily silence console.error for this test since we expect an error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    try {
      // Create a promise that will reject
      const mockRequest = jest.fn().mockRejectedValue(new Error("API Error"));
      (useApi as jest.Mock).mockReturnValue({
        request: mockRequest,
      });

      render(<BillingPage />);

      // Wait for the error state to render after the API call fails
      await waitFor(() => {
        expect(
          screen.getByText("Failed to load payment history")
        ).toBeInTheDocument();
      });
    } finally {
      // Restore console.error even if the test fails
      console.error = originalConsoleError;
    }
  });

  test("renders empty payments state correctly", async () => {
    // Mock the API hook to return empty payments array
    const mockRequest = jest.fn().mockResolvedValue([]);
    (useApi as jest.Mock).mockReturnValue({
      request: mockRequest,
    });

    render(<BillingPage />);

    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(
        screen.getByText("No payment history available.")
      ).toBeInTheDocument();
    });
  });

  test("renders payments table correctly", async () => {
    // Mock the API hook to return payments data
    const mockRequest = jest.fn().mockResolvedValue(mockPayments);
    (useApi as jest.Mock).mockReturnValue({
      request: mockRequest,
    });

    render(<BillingPage />);

    // Wait for the payments to be displayed
    await waitFor(() => {
      // Check table headers
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Amount")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Receipt")).toBeInTheDocument();

      // Check payment data - using more specific selectors to avoid ambiguity
      expect(screen.getAllByText("Premium Plan")).toHaveLength(3);
      expect(screen.getAllByText("$99.99")).toHaveLength(3);

      // Check status values
      const completedStatus = screen.getByText("COMPLETED");
      const pendingStatus = screen.getByText("PENDING");
      const failedStatus = screen.getByText("FAILED");

      expect(completedStatus).toBeInTheDocument();
      expect(pendingStatus).toBeInTheDocument();
      expect(failedStatus).toBeInTheDocument();

      // Check for download button
      expect(screen.getByText("Download")).toBeInTheDocument();
      expect(screen.getAllByText("Processing...")).toHaveLength(2);
    });
  });

  test("downloads receipt when button is clicked", async () => {
    // Mock the API hook to return payments data
    const mockRequest = jest.fn().mockResolvedValue(mockPayments);
    (useApi as jest.Mock).mockReturnValue({
      request: mockRequest,
    });

    render(<BillingPage />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText("Download")).toBeInTheDocument();
    });

    // Click on the download button using act to wrap the event
    await act(async () => {
      fireEvent.click(screen.getByText("Download"));
    });

    // Check if window.location.href was set correctly
    expect(window.location.href).toBe(
      "http://test-api.com/api/receipts/receipt-123/download"
    );
  });

  test("avoids duplicate API requests", async () => {
    // Mock the API hook
    const mockRequest = jest.fn().mockResolvedValue(mockPayments);
    (useApi as jest.Mock).mockReturnValue({
      request: mockRequest,
    });

    // Render the component
    const { rerender } = render(<BillingPage />);

    // Wait for the initial request to complete
    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    // Trigger a re-render explicitly using act
    await act(async () => {
      rerender(<BillingPage />);
    });

    // The request should not be called again
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });
});
