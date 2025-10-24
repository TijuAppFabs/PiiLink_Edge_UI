import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeviceProfile from "./DeviceProfile";
import { getDevices } from "../../services/edgexApi";

// Mock getDevices API
jest.mock("../../services/edgexApi", () => ({
  getDevices: jest.fn(),
}));

// Mock TableView and Modal components
jest.mock("../../components/TableView", () => ({ th, data }) => (
  <table data-testid="tableview">
    <thead>
      <tr>
        {th.map((h, i) => (
          <th key={i}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          <td>{row.id}</td>
          <td>{row.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
));

jest.mock("../../components/Modal", () => ({ title, children, onClose }) => (
  <div data-testid="modal">
    <h2>{title}</h2>
    <button onClick={onClose}>Close</button>
    {children}
  </div>
));

describe("DeviceProfile Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading and description", () => {
    render(<DeviceProfile />);
    expect(screen.getByText("Device Profile")).toBeInTheDocument();
    expect(
      screen.getByText("This is the Device Profile page connected to real API.")
    ).toBeInTheDocument();
  });

  test("opens modal and shows loading state", async () => {
    getDevices.mockResolvedValueOnce({ data: { profiles: [] } });

    render(<DeviceProfile />);
    fireEvent.click(screen.getByText("Show Device Profiles"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/Loading device profiles/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("No device profiles found.")).toBeInTheDocument()
    );
  });

  test("displays device profiles in table", async () => {
    getDevices.mockResolvedValueOnce({
      data: {
        profiles: [
          {
            id: "123",
            name: "DeviceA",
            description: "Test device",
            manufacturer: "EdgeX",
            model: "v1",
            labels: ["sensor", "iot"],
          },
        ],
      },
    });

    render(<DeviceProfile />);
    fireEvent.click(screen.getByText("Show Device Profiles"));

    await waitFor(() =>
      expect(screen.getByTestId("tableview")).toBeInTheDocument()
    );
    expect(screen.getByText("DeviceA")).toBeInTheDocument();
  });

  test("handles API error gracefully", async () => {
    getDevices.mockRejectedValueOnce(new Error("API Error"));

    render(<DeviceProfile />);
    fireEvent.click(screen.getByText("Show Device Profiles"));

    await waitFor(() =>
      expect(screen.getByText("No device profiles found.")).toBeInTheDocument()
    );
  });

  test("closes modal when close button is clicked", async () => {
    getDevices.mockResolvedValueOnce({ data: { profiles: [] } });

    render(<DeviceProfile />);
    fireEvent.click(screen.getByText("Show Device Profiles"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() =>
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
    );
  });
});