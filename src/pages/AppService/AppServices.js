import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BsCalendarEvent,
  BsBook,
  BsPlayFill,
  BsPauseFill,
  BsFilter,
} from "react-icons/bs";
import "./DataCenter.scss";
import edgexApi from "../../services/edgexApi"; // <-- adjust path if different

function DataCenter() {
  const [activeTab, setActiveTab] = useState("event");

  const [eventsRaw, setEventsRaw] = useState([]);
  const [readingsRaw, setReadingsRaw] = useState([]);

  const [events, setEvents] = useState([]);
  const [readings, setReadings] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pollRef = useRef(null);

  // ---- API calls using axios ----
  const fetchEvents = async () => {
    try {
      const { data } = await edgexApi.get("/core-data/api/v3/event/all");
      const items = data.events || [];
      setEventsRaw(items);
      setDevices((prev) => [
        ...new Set([...prev, ...items.map((ev) => ev.deviceName)]),
      ]);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchReadings = async () => {
    try {
      const { data } = await edgexApi.get(
        "/core-data/api/v3/reading/all?offset=0&limit=10"
      );
      const items = data.readings || [];
      setReadingsRaw(items);
      setDevices((prev) => [
        ...new Set([...prev, ...items.map((rd) => rd.deviceName)]),
      ]);
    } catch (err) {
      console.error("Error fetching readings:", err);
    }
  };

  // ---- Polling ----
  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (!isRunning) return;

    if (activeTab === "event") fetchEvents();
    else fetchReadings();

    pollRef.current = setInterval(() => {
      if (activeTab === "event") fetchEvents();
      else fetchReadings();
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isRunning, activeTab]);

  // ---- Filtering ----
  const filteredDevices = useMemo(
    () =>
      devices.filter((d) =>
        d.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [devices, searchTerm]
  );

  useEffect(() => {
    if (activeTab === "event") {
      const filtered = selectedDevices.length
        ? eventsRaw.filter((ev) => selectedDevices.includes(ev.deviceName))
        : eventsRaw;
      setEvents(filtered);
    } else {
      const filtered = selectedDevices.length
        ? readingsRaw.filter((rd) => selectedDevices.includes(rd.deviceName))
        : readingsRaw;
      setReadings(filtered);
    }
  }, [selectedDevices, eventsRaw, readingsRaw, activeTab]);

  const handleDeviceSelect = (device) => {
    setSelectedDevices((prev) =>
      prev.includes(device)
        ? prev.filter((d) => d !== device)
        : [...prev, device]
    );
  };

  // ---- UI helpers ----
  const renderFilterButtonText = () => {
    if (selectedDevices.length === 0) return "Filter Devices";
    if (selectedDevices.length === 1) return selectedDevices[0];
    return `${selectedDevices[0]} (+${selectedDevices.length - 1})`;
  };

  const renderFilterDropdown = () => (
    <div className="dropdown-menu p-3 show filter-dropdown">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search devices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredDevices.length > 0 ? (
        filteredDevices.map((device) => (
          <div key={device} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={device}
              checked={selectedDevices.includes(device)}
              onChange={() => handleDeviceSelect(device)}
            />
            <label className="form-check-label" htmlFor={device}>
              {device}
            </label>
          </div>
        ))
      ) : (
        <p className="text-muted mb-0">No devices found</p>
      )}
    </div>
  );

  const Controls = () => (
    <div className="mb-3 position-relative d-flex gap-2 align-items-center">
      <button className="btn btn-primary" onClick={() => setIsRunning(true)}>
        <BsPlayFill className="me-1" /> Start
      </button>
      <button className="btn btn-secondary" onClick={() => setIsRunning(false)}>
        <BsPauseFill className="me-1" /> Pause
      </button>
      <button
        className="btn btn-info"
        onClick={() => setShowFilterDropdown((prev) => !prev)}
      >
        <BsFilter className="me-1" /> {renderFilterButtonText()}
      </button>
      {showFilterDropdown && renderFilterDropdown()}
    </div>
  );

  // ---- Content ----
  const renderTabContent = () => {
    if (activeTab === "event") {
      return (
        <div className="content-box">
          <Controls />
          {events.length > 0 ? (
            <ul className="list-unstyled">
              {events.map((ev) => (
                <li key={ev.id} className="mb-3 p-2 rounded border">
                  <div>
                    <strong>ID:</strong> {ev.id}
                  </div>
                  <div>
                    <strong>Device:</strong> {ev.deviceName}
                  </div>
                  <div>
                    <strong>Profile:</strong> {ev.profileName}
                  </div>
                  <div>
                    <strong>Origin:</strong>{" "}
                    {ev.origin
                      ? new Date(ev.origin / 1_000_000).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Readings:</strong>
                  </div>
                  <ul className="mb-0">
                    {ev.readings?.map((r, idx) => (
                      <li key={idx}>
                        <strong>{r.resourceName}</strong> ({r.valueType}) ={" "}
                        {r.value}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No events loaded</p>
          )}
        </div>
      );
    }

    return (
      <div className="content-box">
        <Controls />
        {readings.length > 0 ? (
          <pre className="bg-light p-2 rounded">
            {JSON.stringify(readings, null, 2)}
          </pre>
        ) : (
          <p className="text-muted">No readings loaded</p>
        )}
      </div>
    );
  };

  return (
    <div className="datacenter container mt-4">
      <h2>Data Center</h2>

      {/* Tabs styled like AppServices */}
      <div className="section-tabs mb-3">
        <button
          type="button"
          className={`section-tab-btn ${
            activeTab === "event" ? "active" : ""
          }`}
          onClick={() => setActiveTab("event")}
        >
          <BsCalendarEvent className="me-2" />
          Event Data Stream
        </button>
        <button
          type="button"
          className={`section-tab-btn ${
            activeTab === "reading" ? "active" : ""
          }`}
          onClick={() => setActiveTab("reading")}
        >
          <BsBook className="me-2" />
          Reading Data Stream
        </button>
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}

export default DataCenter;
