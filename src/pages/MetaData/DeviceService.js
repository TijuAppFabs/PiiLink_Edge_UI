import React, { useEffect, useState, useCallback, useMemo } from "react";
import TableTopActions from "../../components/TableTopActions";
import ListView from "../../components/ListVIew";
import TableView from "../../components/TableView";
import DeviceIcon from "../../assests/images/HardDrives.svg";
import { getAllDeviceServices, getAllDevices } from "../../services/edgexApi";

const TABLE_HEAD = ["Device Name", "Status", "Associated Count", "Port"];

const DeviceService = () => {
  const [isListView, setIsListView] = useState(true);
  const [deviceServices, setDeviceServices] = useState([]);
  const [deviceCounts, setDeviceCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDeviceServices = useCallback(async () => {
    try {
      // 1. Fetch services
      const response = await getAllDeviceServices();
      const services = response?.data?.services || [];

      const uniqueServices = services.filter(
        (service, index, self) =>
          index === self.findIndex((s) => s.id === service.id)
      );

      setDeviceServices(uniqueServices);

      // 2. Fetch all devices
      const devicesResponse = await getAllDevices();
      const devices = devicesResponse?.data?.devices || [];

      // 3. Count devices per service
      const counts = {};
      uniqueServices.forEach((service) => {
        counts[service.name] = devices.filter(
          (d) => d.serviceName === service.name
        ).length;
      });

      setDeviceCounts(counts);
    } catch (error) {
      console.error("Error fetching device services or devices:", error);
      setDeviceServices([]);
      setDeviceCounts({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeviceServices();
  }, [fetchDeviceServices]);

  // ✅ Automatically recalculates when deviceServices changes
  const DEVICE_STATE = useMemo(
    () => [
      { label: "Total Services", value: deviceServices.length },
      {
        label: "Locked Services",
        value: deviceServices.filter((s) => s.adminState === "LOCKED").length,
      },
      {
        label: "Unlocked Services",
        value: deviceServices.filter((s) => s.adminState === "UNLOCKED").length,
      },
    ],
    [deviceServices]
  );

  const formattedServices = useMemo(
    () =>
      deviceServices.map((service) => {
        let port = "N/A";
        try {
          const url = new URL(service.baseAddress);
          port = url.port || "N/A";
        } catch {
          port = "N/A";
        }

        return {
          id: service.id,
          name: service.name,
          status: service.adminState,
          associatedCount: deviceCounts[service.name] || 0,
          port: port,
        };
      }),
    [deviceServices, deviceCounts]
  );

  return (
    <>
      <div className="device-summary-actions">
        <div className="device-left-summary">
          {DEVICE_STATE.map((stat, index) => (
            <div className="tag-with-value" key={index}>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
        <div className="device-more-actions">
          <TableTopActions
            isListView={isListView}
            handleView={setIsListView}
            showFilter={false}
          />
        </div>
      </div>

      <div className="device-summary-body">
        {loading ? (
          <p>Loading device services...</p>
        ) : isListView ? (
          <ListView
            data={formattedServices}
            icon={DeviceIcon}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <TableView
            th={TABLE_HEAD}
            data={formattedServices.map((service) => ({
              "Device Name": service.name,
              Status: service.status,
              "Associated Count": service.associatedCount,
              Port: service.port,
            }))}
            showActions={false}
          />
        )}
      </div>
    </>
  );
};

export default DeviceService;
