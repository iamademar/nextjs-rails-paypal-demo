import { render, screen } from "@testing-library/react";
import PremiumUpgradePage from "../page";

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

describe("PremiumUpgradePage", () => {
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
    process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID = "";

    render(<PremiumUpgradePage />);

    // Check for error message
    expect(screen.getByText("Configuration Error")).toBeInTheDocument();
    expect(
      screen.getByText(/The Premium Plan ID is not configured/)
    ).toBeInTheDocument();

    // Check for home link
    const homeLink = screen.getByRole("link", { name: /Return to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders the upgrade page when plan ID is set", () => {
    // Set the plan ID
    process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID = "TEST-PREMIUM-PLAN-ID";

    render(<PremiumUpgradePage />);

    // Check for page title
    expect(screen.getByText("Upgrade to Premium Plan")).toBeInTheDocument();

    // Check for plan details
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
    expect(screen.getByText("$199 / month")).toBeInTheDocument();

    // Check for features list
    expect(screen.getByText("What's included:")).toBeInTheDocument();
    expect(screen.getByText("All Basic features plus:")).toBeInTheDocument();
    expect(screen.getByText("Unlimited users")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();
    expect(screen.getByText("10 GB storage")).toBeInTheDocument();
    expect(screen.getByText("Advanced analytics")).toBeInTheDocument();
    expect(screen.getByText("Custom integrations")).toBeInTheDocument();

    // Check for PayPal button with correct props
    const paypalButton = screen.getByTestId("paypal-button");
    expect(paypalButton).toBeInTheDocument();
    expect(paypalButton).toHaveAttribute(
      "data-plan-id",
      "TEST-PREMIUM-PLAN-ID"
    );

    // Check for cancel link
    const cancelLink = screen.getByRole("link", {
      name: /Cancel and return to home/i,
    });
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink).toHaveAttribute("href", "/");
  });
});
