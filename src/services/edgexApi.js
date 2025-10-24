import axios from "axios";

const edgexApi = axios.create({
baseURL: "",
timeout: 10000,
});

// ---------------- Scheduler APIs ----------------
export const getAllSchedules = () =>
edgexApi.get("support-scheduler/api/v3/job/all");

export const getScheduleByName = (name) =>
edgexApi.get(`support-scheduler/api/v3/job/name/${encodeURIComponent(name)}`);

export const addSchedule = (payload) =>
edgexApi.post("support-scheduler/api/v3/job", payload);

export const updateSchedule = (payload) =>
edgexApi.patch("support-scheduler/api/v3/job", payload);

export const deleteScheduleByName = (name) =>
edgexApi.delete(
`support-scheduler/api/v3/job/name/${encodeURIComponent(name)}`
);

// ---------------- Devices-------------------------
export const getDevices = () =>
edgexApi.get("/core-api/api/v3/deviceprofile/all");

export const getAllDevices = () =>
edgexApi.get("/core-api/api/v3/device/all");

export const getDevice = () => edgexApi.get("/core-api/api/v3/device/all");

export const addDevice = (deviceData) =>
edgexApi.post("/core-api/api/v3/device", deviceData);

export const getAllDeviceServices = () =>
edgexApi.get("core-api/api/v3/deviceservice/all");

export const getDevicesByServiceName = (serviceName) =>
edgexApi.get(`/core-metadata/api/v3/device/service/name/${encodeURIComponent(serviceName)}?offset=0&limit=100`);

// ---------------- App Services ----------------
export const getAppServices = () =>
edgexApi.get("/metadata-api/api/v3/registry/all");

// ---------------- Health Check ----------------
export const getServiceHealth = (serviceId) => {
const endpoints = {
"core-command": "/core-command/api/v3/ping",
"core-data": "/core-data/api/v3/ping",
"core-metadata": "/core-api/api/v3/ping",
"support-notifications": "/support-notifications/api/v3/ping",
"support-scheduler": "/support-scheduler/api/v3/ping",
"app-rules-engine": "/app-rules-engine/api/v3/ping",
"device-rest": "/device-rest/api/v3/ping",
"device-virtual": "/device-virtual/api/v3/ping",
"device-opcua": "/device-opcua/api/v3/ping",
};


const endpoint = endpoints[serviceId];
return endpoint ? edgexApi.get(endpoint) : Promise.reject("No health endpoint");
};


export const getAllEvents = () =>
edgexApi.get("/core-data/api/v3/event/all");

export const getAllReadings = (offset = 0, limit = 10) =>
edgexApi.get(`/core-data/api/v3/reading/all?offset=${offset}&limit=${limit}`);


export const deleteDevice = (name) =>
edgexApi.delete(`/core-api/api/v3/device/name/${encodeURIComponent(name)}`);


export default edgexApi;