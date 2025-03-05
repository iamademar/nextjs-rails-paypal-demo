import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock the HealthCheck component to simplify testing
jest.mock("../components/HealthCheck", () => {
  return function MockedHealthCheck() {
    return <div data-testid="health-check">Mocked Health Check</div>;
  };
});

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /NextJS \+ Rails API PayPal Subscription Demo/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the available plans", () => {
    render(<Home />);
    const basicPlan = screen.getByText(/Basic Plan/i);
    const premiumPlan = screen.getByText(/Premium Plan/i);
    expect(basicPlan).toBeInTheDocument();
    expect(premiumPlan).toBeInTheDocument();
  });

  it("renders the upgrade links", () => {
    render(<Home />);
    const basicUpgradeLink = screen.getByRole("link", {
      name: /Upgrade to Basic/i,
    });
    const premiumUpgradeLink = screen.getByRole("link", {
      name: /Upgrade to Premium/i,
    });
    expect(basicUpgradeLink).toBeInTheDocument();
    expect(premiumUpgradeLink).toBeInTheDocument();
  });
});
