import { render, screen } from "@testing-library/react";
import BasicUpgradePage from "../page";

// Mock the PaypalSubscriptionButton component
jest.mock("../../../../components/PaypalSubscriptionButton", () => {
  return function MockPaypalButton(props: any) {
    return (
      <div data-testid="paypal-button" data-plan-id={props.planId}>
        Mocked PayPal Button
      </div>
    );
  };
});

describe("BasicUpgradePage", () => {
  // Store original env for restoration after tests
  const originalEnv = process.env;

  beforeEach(() => {
    // Clone the process.env object for manipulation in tests
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore the original process.env after each test
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("renders the configuration error when plan ID is not set", () => {
    // Ensure plan ID is not set
    process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID = "";

    render(<BasicUpgradePage />);

    // Check for error message
    expect(screen.getByText("Configuration Error")).toBeInTheDocument();
    expect(
      screen.getByText(/The Basic Plan ID is not configured/)
    ).toBeInTheDocument();

    // Check for home link
    const homeLink = screen.getByRole("link", { name: /Return to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders the upgrade page when plan ID is set", () => {
    // Set the plan ID
    process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID = "TEST-PLAN-ID";

    render(<BasicUpgradePage />);

    // Check for page title
    expect(screen.getByText("Upgrade to Basic Plan")).toBeInTheDocument();

    // Check for plan details
    expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    expect(screen.getByText("$139 / month")).toBeInTheDocument();

    // Check for features list
    expect(screen.getByText("What's included:")).toBeInTheDocument();
    expect(screen.getByText("Basic feature access")).toBeInTheDocument();
    expect(screen.getByText("Up to 100 users")).toBeInTheDocument();
    expect(screen.getByText("Email support")).toBeInTheDocument();
    expect(screen.getByText("1 GB storage")).toBeInTheDocument();

    // Check for PayPal button with correct props
    const paypalButton = screen.getByTestId("paypal-button");
    expect(paypalButton).toBeInTheDocument();
    expect(paypalButton).toHaveAttribute("data-plan-id", "TEST-PLAN-ID");

    // Check for cancel link
    const cancelLink = screen.getByRole("link", {
      name: /Cancel and return to home/i,
    });
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink).toHaveAttribute("href", "/");
  });

  it("logs plan ID to console when component mounts", () => {
    // Set the plan ID and spy on console.log
    process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID = "TEST-PLAN-ID";
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    render(<BasicUpgradePage />);

    // Clean up
    consoleSpy.mockRestore();
  });
});
