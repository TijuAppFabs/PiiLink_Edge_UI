import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {Spinner, Button } from "react-bootstrap";
import { FiRefreshCcw } from "react-icons/fi";
import { getAppServices, getServiceHealth } from "../../services/edgexApi";
import "./Appservice.scss";

export default function AppServices() {
  const [activeKey, setActiveKey] = useState("core");
  const [coreData, setCoreData] = useState([]);
  const [supportingData, setSupportingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [healthResults, setHealthResults] = useState({});

  const CORE_SERVICE_IDS = ["core-command", "core-metadata", "core-data"];

  const formatName = (id) =>
    id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const getDescription = (id) => {
    const map = {
      "core-command": "Handles command and control devices.",
      "core-data": "Stores sensor readings and events.",
      "core-metadata": "Manages metadata about devices.",
      "support-notifications": "Handles system-wide notifications.",
      "support-scheduler": "Schedules tasks and jobs.",
    };
    return map[id] || "No description available.";
  };

  const fetchServiceData = () => {
    setLoading(true);
    setHealthResults({});
    getAppServices()
      .then((res) => {
        if (!Array.isArray(res.data.registrations))
          throw new Error("Unexpected data format");

        const core = [], support = [];

        res.data.registrations.forEach((service) => {
          const enriched = {
            ...service,
            name: formatName(service.serviceId),
            description: getDescription(service.serviceId),
          };

          if (CORE_SERVICE_IDS.includes(service.serviceId)) {
            core.push(enriched);
          } else {
            support.push(enriched);
          }
        });

        setCoreData(core);
        setSupportingData(support);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleHealthCheck = async (serviceId) => {
    setHealthResults((prev) => ({
      ...prev,
      [serviceId]: { status: "Checking..." },
    }));

    try {
      const res = await getServiceHealth(serviceId);
      setHealthResults((prev) => ({
        ...prev,
        [serviceId]: { status: "Healthy", data: res.data },
      }));
    } catch (err) {
      setHealthResults((prev) => ({
        ...prev,
        [serviceId]: { status: "Unhealthy", error: err.message },
      }));
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

 const renderServiceCards = (services) => (
  <div className="service-grid">
    {services.map((service, index) => {
      const health = healthResults[service.serviceId];
      return (
        <div key={index} className="app-card">
          <h5>{service.name}</h5>
          <p><strong>Description:</strong> {service.description}</p>
          <p><strong>Service ID:</strong> {service.serviceId}</p>
          <p><strong>Host:</strong> {service.host}</p>
          <p><strong>Port:</strong> {service.port}</p>

          {health && <p><strong>Status:</strong> {health.status}</p>}

          <div className="card-actions">
            <Button
              className="btn-secondary"
              onClick={fetchServiceData}
              title="Refresh"
            >
              <FiRefreshCcw />
            </Button>

            <Button
              className="btn-secondary"
              onClick={() => handleHealthCheck(service.serviceId)}
            >
              Ping
            </Button>
          </div>

          {health?.data && (
            <pre className="bg-light p-2 mt-2 rounded">
              {JSON.stringify(health.data, null, 2)}
            </pre>
          )}

          {health?.error && (
            <div className="text-danger mt-2">{health.error}</div>
          )}
        </div>
      );
    })}
  </div>
);

  return (
    <div className="dashboard d-flex">
      <Sidebar />
      <div className="dashboard-content p-4 w-100 app-service-container">
        <h2>App Services</h2>

        <div className="section-tabs mb-3">
          <button
            type="button"
            className={`section-tab-btn ${activeKey === "core" ? "active" : ""}`}
            onClick={() => setActiveKey("core")}
          >
            Core Services
          </button>
          <button
            type="button"
            className={`section-tab-btn ${activeKey === "support" ? "active" : ""}`}
            onClick={() => setActiveKey("support")}
          >
            Miscellaneous Services
          </button>
        </div>

        <div className="tab-content">
          {activeKey === "core" &&
            (loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" role="status" />
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : (
              renderServiceCards(coreData)
            ))}

          {activeKey === "support" &&
            (loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="secondary" role="status" />
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : (
              renderServiceCards(supportingData)
            ))}
        </div>
      </div>
    </div>
  );
}
