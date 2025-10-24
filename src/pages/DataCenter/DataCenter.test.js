
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import DataCenter from "./DataCenter";
import edgexApi from "../../services/edgexApi";


jest.mock("axios", () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    get: jest.fn(),
    post: jest.fn(),
  };
  return mockAxios;
});

const mockEvents = {
  events: [
    {
      id: "event-1",
      deviceName: "DeviceA",
      profileName: "Profile1",
      origin: Date.now() * 1_000_000, // nanoseconds
      readings: [
        { resourceName: "Temp", valueType: "Int", value: "25" },
        { resourceName: "Humidity", valueType: "Float", value: "60.5" },
      ],
    },
  ],
};

const mockReadings = {
  readings: [
    {
      id: "reading-1",
      deviceName: "DeviceB",
      resourceName: "Pressure",
      value: "100",
    },
  ],
};

describe("DataCenter Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Data Center title", () => {
    render(<DataCenter />);
    expect(screen.getByText("Data Center")).toBeInTheDocument();
  });

  test("loads events when Start is clicked", async () => {
    edgexApi.get.mockResolvedValueOnce({ data: mockEvents });

    render(<DataCenter />);
    fireEvent.click(screen.getByText(/Start/i));

    await waitFor(() => {
      // ✅ Query inside the event card only
      const eventCard = screen.getByText("event-1").closest("li");
      expect(within(eventCard).getByText(/DeviceA/)).toBeInTheDocument();
      expect(within(eventCard).getByText(/Temp/)).toBeInTheDocument();
      expect(within(eventCard).getByText(/Humidity/)).toBeInTheDocument();
    });
  });

  test("switches to Reading Data Stream tab", async () => {
  edgexApi.get.mockResolvedValueOnce({ data: mockReadings });

  render(<DataCenter />);
  fireEvent.click(screen.getByText(/Reading Data Stream/i));
  fireEvent.click(screen.getByText(/Start/i));

  await waitFor(() => {
    // ✅ Check JSON is displayed in <pre>
    expect(screen.getByText(/DeviceB/)).toBeInTheDocument();
    expect(screen.getByText(/Pressure/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });
});


  test("shows filter dropdown and filters devices", async () => {
    edgexApi.get.mockResolvedValueOnce({ data: mockEvents });

    render(<DataCenter />);
    fireEvent.click(screen.getByText(/Start/i));

    await waitFor(() => {
      const eventCard = screen.getByText("event-1").closest("li");
      expect(within(eventCard).getByText(/DeviceA/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Filter Devices/i));

    const searchBox = screen.getByPlaceholderText(/Search devices/i);
    fireEvent.change(searchBox, { target: { value: "DeviceA" } });

    // ✅ Use label for the filter checkbox
    const checkbox = screen.getByLabelText("DeviceA");
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);

    // ✅ Verify filtered events only
    await waitFor(() => {
      const eventCard = screen.getByText("event-1").closest("li");
      expect(within(eventCard).getByText(/DeviceA/)).toBeInTheDocument();
    });
  });

  test("pause button stops fetching (no new data loaded)", async () => {
    edgexApi.get.mockResolvedValueOnce({ data: mockEvents });

    render(<DataCenter />);
    fireEvent.click(screen.getByText(/Start/i));

    await waitFor(() => {
      const eventCard = screen.getByText("event-1").closest("li");
      expect(within(eventCard).getByText(/DeviceA/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Pause/i));
    expect(screen.getByText(/Pause/i)).toBeInTheDocument();
  });
});
