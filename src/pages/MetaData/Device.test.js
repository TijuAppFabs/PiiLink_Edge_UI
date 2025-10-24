// Device.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Device from "./Device";
import {
  getDevice,
  getAllDeviceServices,
  getDevices,
  addDevice,
  deleteDevice,
} from "../../services/edgexApi";

// Mock the API services
jest.mock("../../services/edgexApi", () => ({
  getDevice: jest.fn(),
  getAllDeviceServices: jest.fn(),
  getDevices: jest.fn(),
  addDevice: jest.fn(),
  deleteDevice: jest.fn(),
}));

describe("Device Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    getDevice.mockResolvedValueOnce({ data: { devices: [] } });

    render(<Device />);

    // Loading state
    expect(await screen.findByText(/Loading devices/i)).toBeInTheDocument();
  });

  it("renders devices in list view", async () => {
    getDevice.mockResolvedValueOnce({
      data: {
        devices: [
          {
            id: "1",
            name: "Device 1",
            adminState: "UNLOCKED",
            serviceName: "Service1",
            operatingState: "UP",
            labels: ["tag1"],
          },
        ],
      },
    });

    render(<Device />);

    // Wait for device row to appear
    expect(await screen.findByText(/Device 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Service1/i)).toBeInTheDocument();
  });

  it("opens modal on Add button click", async () => {
    getDevice.mockResolvedValueOnce({ data: { devices: [] } });
    getAllDeviceServices.mockResolvedValueOnce({ data: { services: [] } });

    render(<Device />);

    const addButton = await screen.findByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    // Modal title
    expect(await screen.findByText(/Add new Device/i)).toBeInTheDocument();
  });

 it("shows 'No device services found' when API returns empty", async () => {
  getDevice.mockResolvedValueOnce({ data: { devices: [] } });
  getAllDeviceServices.mockResolvedValueOnce({ data: { services: [] } });

  render(<Device />);

  const addButton = await screen.findByRole("button", { name: /add/i });
  fireEvent.click(addButton);

  // Wait for the useEffect to set deviceServices
  await waitFor(() => {
    expect(screen.getByText(/No device services found/i)).toBeInTheDocument();
  });
});


  it("selects and deletes a device", async () => {
    getDevice.mockResolvedValueOnce({
      data: {
        devices: [
          {
            id: "1",
            name: "Device 1",
            adminState: "UNLOCKED",
            serviceName: "Service1",
            operatingState: "UP",
            labels: [],
          },
        ],
      },
    });

    deleteDevice.mockResolvedValueOnce({});
    
    render(<Device />);

    // Wait for device to appear
    const deviceRow = await screen.findByText(/Device 1/i);
    
    // Select device
    fireEvent.click(deviceRow);

    // Delete button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    
    // Mock window.alert
    window.alert = jest.fn();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteDevice).toHaveBeenCalledWith("Device 1");
      expect(window.alert).toHaveBeenCalledWith("Device deleted successfully!");
    });
  });

  it("handles delete device not found gracefully", async () => {
    getDevice.mockResolvedValueOnce({
      data: {
        devices: [
          {
            id: "1",
            name: "Device 1",
            adminState: "UNLOCKED",
          },
        ],
      },
    });

    render(<Device />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // No selection
    window.alert = jest.fn();
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });
});
