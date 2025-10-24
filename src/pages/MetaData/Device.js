import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import TableTopActions from "../../components/TableTopActions";
import ListView from "../../components/ListVIew";
import TableView from "../../components/TableView";
import DeviceIcon from "../../assests/images/HardDrives.svg";
import AddIcon from "../../assests/images/add.svg";
import Modal from "../../components/Modal";
import BackIcon from "../../assests/images/arrow-left.svg";
import PlusIcon from "../../assests/images/plus.svg";
import SectionTabs from "../../components/SectionTabs";
import { v4 as uuidv4 } from "uuid";
import DevicePrimary from "./DevicePrimary";  
import {
  getDevice,
  getAllDeviceServices,
  getDevices,
  addDevice,
  deleteDevice, 
} from "../../services/edgexApi";

const TABLE_HEAD = [
  "Device Name",
  "Status",
  "Associated Count",
  "URL",
  "Operating Status",
  "Last Connected",
  "Last Reported",
];

const TAB_HEADING = [
  { id: "availableProtocolTemplate", label: "Available Protocol Template" },
  { id: "customProtocolTemplates", label: "Custom Protocol Templates" },
];

const Device = () => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [activeTab, setActiveTab] = useState(TAB_HEADING[0].id);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [deviceServices, setDeviceServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [deviceProfiles, setDeviceProfiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);


  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    labels: "",
    adminState: "",
  });

  const handleFormChange = useCallback((field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFormDataChange = useCallback((formData) => {
    setFormValues(formData);
  }, []);

  const modalToggleHandler = (show) => {
    setIsModalShow(show);
  };

  const viewHandler = (show) => {
    setIsListView(show);
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddSave = async (formValues) => {
  try {
    const payload = [
      {
        apiVersion: "v3",
        requestId: uuidv4(),
        device: {
          name: formValues.name,
          description: formValues.description,
          adminState: formValues.adminState
            ? formValues.adminState.toUpperCase()
            : "UNLOCKED",
          operatingState: "UP",
          labels: formValues.labels ? formValues.labels.split(",") : [],
          serviceName: selectedService,
          profileName: selectedProfile,
          protocols: {
            opcua: {
              Endpoint: "opc.tcp://localhost:4840" // ✅ must be valid
            }
          },
          autoEvents: [
            {
              interval: "5ms",
              onChange: false,
              sourceName: "Random"
            }
          ],
        },
      },
    ];




await addDevice(payload, {
headers: { "Content-Type": "application/json" },
});


      const res = await getDevices();
      const fetchedDevices = res.data.devices || [];

      const formattedDevices = fetchedDevices.map((d) => ({
        id: d.id || d.name,
        name: d.name,
        status: d.adminState || "UNKNOWN",
        // associatedCount: d.labels?.length || 0,
        url: d.serviceName || "N/A",
        operatingStatus: d.operatingState || "N/A",
        lastConnected: d.lastConnected || "N/A",
        lastReported: d.lastReported || "N/A",
      }));

      setDevices(formattedDevices);
      setIsModalShow(false);
    } catch (error) {
      console.error("Error adding device:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await getDevice();
        const fetchedDevices = response.data.devices || [];
        if (fetchedDevices.length > 0) {
          const formattedDevices = fetchedDevices.map((d) => ({
            id: d.id || d.name, 
            name: d.name,
            status: d.adminState || d.status || "UNKNOWN",
            // associatedCount: d.labels?.length || d.associatedCount || 0,
            url: d.serviceName || d.url || "N/A",
            operatingStatus: d.operatingState || d.operatingStatus || "N/A",
            lastConnected: d.lastConnected || "N/A",
            lastReported: d.lastReported || "N/A",
          }));
          setDevices(formattedDevices);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    if (isModalShow) {
      getAllDeviceServices()
        .then((res) => setDeviceServices(res.data.services || []))
        .catch(() => setDeviceServices([]));
      setSelectedService("");
      setSelectedProfile(null);
      setStep(1);
      setFormValues({
        name: "",
        description: "",
        labels: "",
        adminState: "",
      });
    }
  }, [isModalShow]);

  useEffect(() => {
    if (isModalShow && step === 2) {
      getDevices()
        .then((res) => setDeviceProfiles(res.data.profiles || []))
        .catch(() => setDeviceProfiles([]));
    }
  }, [isModalShow, step]);

  const SelectDevice = () => (
    <div className="device-summary-body">
      {deviceServices.length === 0 ? (
        <p>No device services found.</p>
      ) : (
        deviceServices.map((svc) => (
          <div
            key={svc.name}
            className={`list-view-item${
              selectedService === svc.name ? " selected" : ""
            }`}
            onClick={() => setSelectedService(svc.name)}
            style={{
              cursor: "pointer",
              boxShadow:
                selectedService === svc.name
                  ? "inset 0 0 0 9999px rgba(0, 123, 255, 0.15)"
                  : "none",
              border:
                selectedService === svc.name
                  ? "1px solid rgba(0, 123, 255, 0.4)"
                  : "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <div className="list-view-item-icon">
              <img src={DeviceIcon} alt="Icon" />
            </div>
            <div className="list-view-item-content">
              <div className="list-view-item-informations">
                <div className="list-view-header">
                  <h3>{svc.name}</h3>
                </div>
                <div className="device-description">
                  {svc.description || "No description available"}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const DeviceProfile = () => (
    <div className="device-summary-body">
      {deviceProfiles.map((profile) => (
        <div
          key={profile.name}
          className={`list-view-item${
            selectedProfile === profile.name ? " selected" : ""
          }`}
          onClick={() => setSelectedProfile(profile.name)}
          style={{
            cursor: "pointer",
            boxShadow:
              selectedProfile === profile.name
                ? "inset 0 0 0 9999px rgba(0, 123, 255, 0.15)"
                : "none",
            border:
              selectedProfile === profile.name
                ? "1px solid rgba(0, 123, 255, 0.4)"
                : "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <div className="list-view-item-icon">
            <img src={DeviceIcon} alt="Icon" />
          </div>
          <div className="list-view-item-content">
            <div className="list-view-item-informations">
              <div className="list-view-header">
                <h3>{profile.name}</h3>
              </div>
              <div className="device-description">{profile.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CreateAutoEvent = () => {
    const [showAutoEventForm, setShowAutoEventForm] = useState(false);
    const [autoEvents, setAutoEvents] = useState([]);

    const handleAddAutoEvent = () => {
      setShowAutoEventForm(true);
      setAutoEvents([
        { interval: "", unit: "millisecond", onChange: "false", resource: "" },
      ]);
    };

    const handleAutoEventChange = (index, field, value) => {
      const updatedEvents = [...autoEvents];
      updatedEvents[index][field] = value;
      setAutoEvents(updatedEvents);
    };

    const handleRemove = (index) => {
      const updatedEvents = autoEvents.filter((_, i) => i !== index);
      setAutoEvents(updatedEvents);
    };

    const handleAddMore = () => {
      setAutoEvents([
        ...autoEvents,
        { interval: "", unit: "millisecond", onChange: "false", resource: "" },
      ]);
    };

    return (
      <div className="steps-body-item">
        {!showAutoEventForm ? (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "6px",
              }}
              onClick={handleAddAutoEvent}
            >
              <img src={PlusIcon} alt="Icon" style={{ width: "18px" }} />
              <span>Add Auto Events</span>
            </button>
            <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
              This step is optional. You can skip it and set it later in edit
              mode.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {autoEvents.map((event, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  background: "#fafafa",
                  width: "100%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "6px" }}>
                    Interval
                  </label>
                  <input
                    type="number"
                    placeholder="Enter interval"
                    value={event.interval}
                    onChange={(e) =>
                      handleAutoEventChange(idx, "interval", e.target.value)
                    }
                    style={{
                      width: "55%",
                      padding: "14px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "6px" }}>
                    Unit
                  </label>
                  <select
                    value={event.unit}
                    onChange={(e) =>
                      handleAutoEventChange(idx, "unit", e.target.value)
                    }
                    style={{
                      width: "55%",
                      padding: "14px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  >
                    <option value="millisecond">millisecond</option>
                    <option value="second">second</option>
                  </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "6px" }}>
                    On Change
                  </label>
                  <select
                    value={event.onChange}
                    onChange={(e) =>
                      handleAutoEventChange(idx, "onChange", e.target.value)
                    }
                    style={{
                      width: "55%",
                      padding: "14px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "6px" }}>
                    Resource
                  </label>
                  <input
                    type="text"
                    placeholder="Resource"
                    value={event.resource}
                    onChange={(e) =>
                      handleAutoEventChange(idx, "resource", e.target.value)
                    }
                    style={{
                      width: "55%",
                      padding: "14px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    style={{
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMore}
                    style={{
                      background: "#3498db",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Add More AutoEvent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AvailableProtocolTemplate = ({
    selectedProtocol,
    setSelectedProtocol,
  }) => {
    const protocols = [
      "device-mqtt",
      "device-rest",
      "device-virtual",
      "device-modbus-tcp",
      "device-modbus-rtu",
      "device-onvif-camera",
      "device-opcua",
      "device-s7",
      "device-rfid-llrp",
    ];

    return (
      <div className="form-control-item">
        <label className="block text-sm font-medium mb-2">Protocol Name</label>
        <select
          value={selectedProtocol}
          onChange={(e) => setSelectedProtocol(e.target.value)}
          className="form-control"
        >
          <option value="">-- Select Protocol --</option>
          {protocols.map((proto) => (
            <option key={proto} value={proto}>
              {proto}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const CustomProtocolTemplates = () => (
    <div className="form-control-item">
      <p className="text-gray-700 text-sm">This is Custom Protocol Template</p>
    </div>
  );

  const CreateDeviceProtocol = () => {
    const [activeTab, setActiveTab] = useState("available");
    const [selectedProtocol, setSelectedProtocol] = useState("");

    const TAB_HEADING = [
      { id: "available", label: "Available Protocol Templates" },
      { id: "custom", label: "Custom Protocol Templates" },
    ];

    const renderContent = () => {
      switch (activeTab) {
        case "available":
          return (
            <AvailableProtocolTemplate
              selectedProtocol={selectedProtocol}
              setSelectedProtocol={setSelectedProtocol}
            />
          );
        case "custom":
          return <CustomProtocolTemplates />;
        default:
          return null;
      }
    };

    return (
      <div className="steps-body-item">
        <div className="steps-body-item-box">
          <SectionTabs
            version="style-2"
            tabs={TAB_HEADING}
            activeTab={activeTab}
            onTabClick={(id) => setActiveTab(id)}
          />
          <div className="tab-body border rounded-lg p-4 bg-white shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <SelectDevice />;
      case 2:
        return <DeviceProfile />;
   case 3:
  return (
    <DevicePrimary
      formValues={formValues}
      setFormValues={setFormValues}   // ✅ pass this instead
    />
  );


      case 4:
        return <CreateAutoEvent key={isModalShow ? "auto-event" : "auto-event-closed"} />;
      case 5:
        return <CreateDeviceProtocol />;
      default:
        return null;
    }
  };

  const isPrimaryValid = useMemo(() => {
    return (
      formValues.name.trim() !== "" ||
      formValues.description.trim() !== "" ||
      formValues.labels.trim() !== "" ||
      formValues.adminState.trim() !== ""
    );
  }, [
    formValues.name,
    formValues.description,
    formValues.labels,
    formValues.adminState,
  ]);
  

  const AddNewDevice = () => (
    <div className="steps-wrapper">
      <div className="steps-header">
        <ul className="steps-list">
          <li className={step === 1 ? "active" : step > 1 ? "done" : ""}>
            <span className
="steps-count">01</span>
            <span className="steps-label">Select Device Service</span>
          </li>
          <li className={step === 2 ? "active" : step > 2 ? "done" : ""}>
            <span className="steps-count">02</span>
            <span className="steps-label">Device Profile</span>
          </li>
          <li className={step === 3 ? "active" : step > 3 ? "done" : ""}>
            <span className="steps-count">03</span>
            <span className="steps-label">Device Primary</span>
          </li>
          <li className={step === 4 ? "active" : step > 4 ? "done" : ""}>
            <span className="steps-count">04</span>
            <span className="steps-label">Create Auto Event</span>
          </li>
          <li className={step === 5 ? "active" : step > 5 ? "done" : ""}>
            <span className="steps-count">05</span>
            <span className="steps-label">Create Device Protocol</span>
          </li>
        </ul>
      </div>
      <div className="steps-body">{renderStepContent()}</div>
      <div className="steps-footer">
        {step < 5 && (
          <button
            onClick={nextStep}
            className="btn-secondary"
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedProfile) ||
              (step === 3 && !isPrimaryValid)
            }
          >
            Next
          </button>
        )}
        {step === 5 && (
          <button
            className="btn-secondary green"
            onClick={() => handleAddSave(formValues)} // 🔹 pass your collected values
          >
            Submit
          </button>
        )}
        {step > 1 && (
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="btn-without-border no-btn"
          >
            <img src={BackIcon} alt="Back" />
            Back
          </button>
        )}
        <p>
          {step} selected <span>/ 5</span>
        </p>
      </div>
    </div>
  );
  // Highlight and select logic for device cards
  const handleDeviceClick = (deviceId) => {
    setSelectedDevices([deviceId]); // Only one selection at a time
  };

  return (
    <>
      <div className="device-summary-actions">
        <div className="device-left-summary">
          <button
            type="button"
            className="no-btn btn-without-border"
            onClick={() => modalToggleHandler(true)}
          >
            <img src={AddIcon} alt="Add" />
            <span>Add</span>
          </button>
          <button
            type="button"
            className={`no-btn btn-without-border${selectedDevices.length > 0 ? '' : ' disabled'}`}
            disabled={selectedDevices.length === 0}
            onClick={async () => {
              if (selectedDevices.length > 0) {
                const deviceId = selectedDevices[0];
                const device = devices.find(d => d.id === deviceId);
                if (!device) {
                  alert('Device not found');
                  return;
                }
                try {
                  await deleteDevice(device.name); // Use the correct delete API
                  setDevices(prev => prev.filter(d => d.id !== deviceId));
                  setSelectedDevices([]);
                  alert('Device deleted successfully!');
                } catch (err) {
                  alert('Failed to delete device: ' + (err?.response?.data?.message || err.message));
                }
              }
            }}
          >
            <span>Delete</span>
          </button>
        </div>
        <div className="device-more-actions">
          <TableTopActions
            isListView={isListView}
            handleView={(isList) => viewHandler(isList)}
          />
        </div>
      </div>

      <div className="device-summary-body">
        {loading ? (
          <p>Loading devices...</p>
        ) : isListView ? (
          <ListView
            data={devices}
            icon={DeviceIcon}
            selectedIds={selectedDevices}
            onRowClick={handleDeviceClick}
          />
        ) : (
          <TableView th={TABLE_HEAD} data={devices} />
        )}
      </div>

      {isModalShow && (
        <Modal title="Add new Device" onClose={() => modalToggleHandler(false)}>
          <AddNewDevice />
        </Modal>
      )}
    </>
  );
};

export default Device;
