// Scheduler.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Scheduler from "./Scheduler";
import * as api from "../../services/edgexApi";
import { MemoryRouter } from "react-router-dom";

// Mock the API calls
jest.mock("../../services/edgexApi", () => ({
  getAllSchedules: jest.fn(),
  getScheduleByName: jest.fn(),
  addSchedule: jest.fn(),
  updateSchedule: jest.fn(),
  deleteScheduleByName: jest.fn(),
}));

describe("Scheduler Component", () => {
  const mockSchedules = [
    {
      id: "1",
      name: "Test Job 1",
      definition: { type: "CRON", crontab: "0 0 * * *" },
      actions: [{ type: "REST" }],
      adminState: "UNLOCKED",
    },
    {
      id: "2",
      name: "Test Job 2",
      definition: { type: "INTERVAL", crontab: "" },
      actions: [{ type: "MQTT" }],
      adminState: "LOCKED",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Scheduler and Add button", async () => {
    api.getAllSchedules.mockResolvedValue({ data: { scheduleJobs: [] } });

    render(
      <MemoryRouter>
        <Scheduler />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.getAllSchedules).toHaveBeenCalled());

    expect(screen.getByText(/add/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  test("opens modal when Add button is clicked", async () => {
    api.getAllSchedules.mockResolvedValue({ data: { scheduleJobs: [] } });

    render(
      <MemoryRouter>
        <Scheduler />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.getAllSchedules).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/add/i));

    expect(screen.getByText(/add job/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/job name/i)).toBeInTheDocument();
  });

  test("disables Edit and Delete buttons when no schedule selected", async () => {
  api.getAllSchedules.mockResolvedValue({ data: { scheduleJobs: [] } });

  render(
    <MemoryRouter>
      <Scheduler />
    </MemoryRouter>
  );

  await waitFor(() => expect(api.getAllSchedules).toHaveBeenCalled());

  // Grab the buttons themselves
  const editButton = screen.getByRole("button", { name: /edit/i });
  const deleteButton = screen.getByRole("button", { name: /delete/i });

  expect(editButton).toBeDisabled();
  expect(deleteButton).toBeDisabled();
});


  test("enables Edit button when one schedule selected", async () => {
    api.getAllSchedules.mockResolvedValue({ data: { scheduleJobs: mockSchedules } });
    api.getScheduleByName.mockResolvedValue({ data: { scheduleJob: mockSchedules[0] } });

    render(
      <MemoryRouter>
        <Scheduler />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.getAllSchedules).toHaveBeenCalled());

    // select first schedule
    const listRow = screen.getByText("Test Job 1");
    fireEvent.click(listRow);

    const editButton = screen.getByText(/edit/i);
    expect(editButton).not.toBeDisabled();

    // click Edit and open modal
    fireEvent.click(editButton);
    await waitFor(() => expect(screen.getByText(/edit job/i)).toBeInTheDocument());
  });

  test("deletes selected schedule", async () => {
    api.getAllSchedules.mockResolvedValue({ data: { scheduleJobs: mockSchedules } });
    api.deleteScheduleByName.mockResolvedValue({});
    window.confirm = jest.fn(() => true); // mock confirm to always yes

    render(
      <MemoryRouter>
        <Scheduler />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.getAllSchedules).toHaveBeenCalled());

    fireEvent.click(screen.getByText("Test Job 1")); // select first schedule

    fireEvent.click(screen.getByText(/delete/i));
    await waitFor(() => expect(api.deleteScheduleByName).toHaveBeenCalledWith("Test Job 1"));
  });

  test("renders loading state", () => {
    api.getAllSchedules.mockImplementation(() => new Promise(() => {})); // never resolves

    render(
      <MemoryRouter>
        <Scheduler />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders No schedules found when empty", async () => {
    api.getAllSchedules.mockResolvedValue({ data: { scheduleJobs: [] } });

    render(
      <MemoryRouter>
        <Scheduler />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/no schedules found/i)).toBeInTheDocument());
  });
});
