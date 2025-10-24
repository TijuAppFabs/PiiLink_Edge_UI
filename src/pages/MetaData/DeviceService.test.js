// src/pages/MetaData/DeviceService.test.js
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DeviceService from "./DeviceService";
import { getAllDeviceServices } from "../../services/edgexApi";

// Mock child components (to avoid deep rendering issues)
jest.mock("../../components/TableTopActions", () => ({ isListView, handleView }) => (
  <button onClick={() => handleView(!isListView)}>
    {isListView ? "Switch to Table" : "Switch to List"}
  </button>
));
jest.mock("../../components/ListVIew", () => ({ data }) => (
  <div data-testid="list-view">
    {data.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
));
jest.mock("../../components/TableView", () => ({ th, data }) => (
  <table data-testid="table-view">
    <thead>
      <tr>{th.map((h, i) => <th key={i}>{h}</th>)}</tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          {Object.values(row).map((v, j) => <td key={j}>{v}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
));

// Mock API
jest.mock("../../services/edgexApi", () => ({
  getAllDeviceServices: jest.fn(),
}));

// Suppress console.error for network error logs in tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
});

describe("DeviceService Component", () => {
  const mockServices = {
    data: {
      services: [
        { id: "1", name: "DeviceA", adminState: "LOCKED", baseAddress: "http://localhost:48082" },
        { id: "2", name: "DeviceB", adminState: "UNLOCKED", baseAddress: "http://localhost:48083" },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", async () => {
    getAllDeviceServices.mockResolvedValueOnce(mockServices);

    render(<DeviceService />);
    expect(screen.getByText(/Loading device services.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading device services.../i)).not.toBeInTheDocument();
    });
  });

  test("renders device state summary correctly", async () => {
    getAllDeviceServices.mockResolvedValueOnce(mockServices);

    render(<DeviceService />);

    await waitFor(() => {
      expect(screen.getByText("Total Services")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Locked Services")).toBeInTheDocument();
      expect(screen.getByText("Unlocked Services")).toBeInTheDocument();

      // Locked count = 1, Unlocked count = 1
      expect(screen.getAllByText("1")).toHaveLength(2);
    });
  });

  test("renders ListView by default", async () => {
    getAllDeviceServices.mockResolvedValueOnce(mockServices);

    render(<DeviceService />);

    await waitFor(() => {
      expect(screen.getByTestId("list-view")).toBeInTheDocument();
      expect(screen.getByText("DeviceA")).toBeInTheDocument();
      expect(screen.getByText("DeviceB")).toBeInTheDocument();
    });
  });

  test("switches to TableView when toggle button is clicked", async () => {
    getAllDeviceServices.mockResolvedValueOnce(mockServices);

    render(<DeviceService />);

    const toggleBtn = await screen.findByText("Switch to Table");
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByTestId("table-view")).toBeInTheDocument();
      expect(screen.getByText("DeviceA")).toBeInTheDocument();
      expect(screen.getByText("DeviceB")).toBeInTheDocument();
    });
  });

  test("handles API error gracefully", async () => {
    getAllDeviceServices.mockRejectedValueOnce(new Error("Network Error"));

    render(<DeviceService />);

    await waitFor(() => {
      // Should still render empty ListView
      expect(screen.getByTestId("list-view")).toBeInTheDocument();
      expect(screen.queryByText("DeviceA")).not.toBeInTheDocument();
    });
  });
});
