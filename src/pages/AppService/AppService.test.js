// AppServices.test.js
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AppServices from "./AppService";

import { getAppServices, getServiceHealth } from "../../services/edgexApi";

// ✅ Mock APIs
jest.mock("../../services/edgexApi", () => ({
  getAppServices: jest.fn(),
  getServiceHealth: jest.fn(),
}));

// ✅ Mock Sidebar to avoid rendering full layout
jest.mock("../../components/Sidebar/Sidebar", () => () => (
  <div data-testid="sidebar">Sidebar</div>
));

describe("AppServices Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner while fetching", async () => {
    getAppServices.mockReturnValue(new Promise(() => {})); // pending promise

    render(<AppServices />);

    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner should show
  });

  test("renders error message when API fails", async () => {
    getAppServices.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<AppServices />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });
  });

  test("renders core service cards on success", async () => {
    getAppServices.mockResolvedValueOnce({
      data: {
        registrations: [
          {
            serviceId: "core-data",
            host: "localhost",
            port: 59880,
          },
        ],
      },
    });

    render(<AppServices />);

    // Wait until card appears
    expect(await screen.findByText("Core Data")).toBeInTheDocument();
    expect(screen.getByText(/Stores sensor readings and events/i)).toBeInTheDocument();
    expect(screen.getByText(/localhost/i)).toBeInTheDocument();
  });

  test("switches to support services tab", async () => {
    getAppServices.mockResolvedValueOnce({
      data: {
        registrations: [
          {
            serviceId: "support-notifications",
            host: "localhost",
            port: 59860,
          },
        ],
      },
    });

    render(<AppServices />);

    // Wait until fetch finishes
    await waitFor(() =>
      expect(screen.getByText("Miscellaneous Services")).toBeInTheDocument()
    );

    // Click support tab
    fireEvent.click(screen.getByText("Miscellaneous Services"));

    expect(await screen.findByText("Support Notifications")).toBeInTheDocument();
  });

  test("handles health check success", async () => {
    getAppServices.mockResolvedValueOnce({
      data: {
        registrations: [
          {
            serviceId: "core-data",
            host: "localhost",
            port: 59880,
          },
        ],
      },
    });

    getServiceHealth.mockResolvedValueOnce({
      data: { status: "pass" },
    });

    render(<AppServices />);

    // Wait for card to render
    const pingButton = await screen.findByRole("button", { name: /Ping/i });
    fireEvent.click(pingButton);

    await waitFor(() =>
      expect(screen.getByText(/Healthy/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/pass/i)).toBeInTheDocument();
  });

  test("handles health check failure", async () => {
    getAppServices.mockResolvedValueOnce({
      data: {
        registrations: [
          {
            serviceId: "core-data",
            host: "localhost",
            port: 59880,
          },
        ],
      },
    });

    getServiceHealth.mockRejectedValueOnce(new Error("Unreachable"));

    render(<AppServices />);

    const pingButton = await screen.findByRole("button", { name: /Ping/i });
    fireEvent.click(pingButton);

    await waitFor(() =>
      expect(screen.getByText(/Unhealthy/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Unreachable/i)).toBeInTheDocument();
  });
});
