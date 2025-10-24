import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllSchedules,
    getScheduleByName,
    addSchedule,
    updateSchedule,
    deleteScheduleByName,
} from "../../services/edgexApi";
import TableView from "../../components/TableView/TableView";
import ListView from "../../components/ListVIew";
import TableTopActions from "../../components/TableTopActions";
import SchedulerIcon from "../../assests/images/HardDrives.svg";
import Modal from "../../components/Modal/Modal";
import "./Scheduler.scss";

function Scheduler() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [isListView, setIsListView] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await getAllSchedules();
            setSchedules(response.data.scheduleJobs || []);
        } catch (err) {
            console.error("Error fetching schedules:", err);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleEdit = async () => {
        if (selectedIds.length === 1) {
            const schedule = schedules.find((s) => s.id === selectedIds[0]);
            if (schedule?.name) {
                const details = await getScheduleByName(schedule.name);
                if (details?.data?.scheduleJob) {
                    setEditingSchedule(details.data.scheduleJob);
                    setIsModalOpen(true);
                }
            }
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;
        if (
            !window.confirm(
                `Are you sure you want to delete ${selectedIds.length} schedule(s)?`
            )
        )
            return;

        try {
            const jobsToDelete = schedules.filter((s) => selectedIds.includes(s.id));

            await Promise.all(
                jobsToDelete.map(async (job) => {
                    if (job?.name) {
                        await deleteScheduleByName(job.name);
                    }
                })
            );

            alert("Selected schedule(s) deleted successfully ✅");
            setSelectedIds([]);
            await fetchSchedules();
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err);
            alert("Failed to delete schedule(s). Check console for details.");
        }
    };

    const handleSave = async (formData, isUpdate) => {
        const name = formData.name?.trim();
        if (!name) return alert("Name is required!");

        const payload = [
            {
                apiVersion: "v3",
                scheduleJob: {
                    name,
                    definition: {
                        type: formData.type || "CRON",
                        crontab: formData.crontab || "",
                    },
                    actions: [
                        {
                            type: formData.actionType || "REST",
                            address: "http://localhost:59861/api/v3/ping",
                            method: "POST",
                            contentType: "application/json",
                            content: JSON.stringify({ message: "Hello EdgeX!" }),
                        },
                    ],
                    adminState: formData.adminState || "UNLOCKED",
                    autoTriggerMissedRecords: true,
                },
            },
        ];

        try {
            if (isUpdate) {
                await updateSchedule(payload);
                alert("Schedule updated successfully ✅");
            } else {
                await addSchedule(payload);
                alert("Schedule added successfully ✅");
            }

            await fetchSchedules();
            setEditingSchedule(null);
            setIsModalOpen(false);
        } catch (err) {
            console.error(
                `${isUpdate ? "Update" : "Add"} failed:`,
                err.response?.data || err
            );
            alert("Failed to save job. Check console for details.");
        }
    };

    const tableHeaders = ["ID", "Name", "Type", "Crontab", "Action", "Status"];

    const tableData = schedules.map((s) => ({
        ID: s.id,
        Name: s.name,
        Type: s.definition?.type,
        Crontab: s.definition?.crontab || "N/A",
        Action: s.actions?.[0]?.type || "N/A",
        Status: s.adminState,
    }));

    const listData = schedules.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.definition?.type,
        crontab: s.definition?.crontab || "N/A",
        action: s.actions?.[0]?.type || "N/A",
        status: s.adminState,
    }));

    return (
        <div>
            <div className="device-summary-actions">
                <div className="device-left-summary">
                    <button
                        type="button"
                        className="no-btn btn-without-border"
                        onClick={() => {
                            setEditingSchedule(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <span>Add</span>
                    </button>

                    <button
                        type="button"
                        className="no-btn btn-without-border"
                        onClick={handleEdit}
                        disabled={selectedIds.length !== 1}
                    >
                        <span>Edit</span>
                    </button>

                    <button
                        type="button"
                        className="no-btn btn-without-border"
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0}
                    >
                        <span>Delete</span>
                    </button>
                </div>

                <div className="device-more-actions">
                    <TableTopActions
                        isListView={isListView}
                        handleView={(isList) => setIsListView(isList)}
                    />
                </div>
            </div>

            <div className="device-summary-body">
                {loading ? (
                    <p>Loading...</p>
                ) : schedules.length === 0 ? (
                    <p>No schedules found.</p>
                ) : isListView ? (
                    <ListView
                        data={listData}
                        icon={SchedulerIcon}
                        viewType="scheduler"
                        selectedIds={selectedIds}
                        onRowClick={handleSelect}
                    />
                ) : (
                    <TableView
                        th={tableHeaders}
                        data={tableData}
                        showCommand={false}
                        selectedIds={selectedIds}
                        onRowClick={handleSelect}
                    />
                )}
            </div>

            {isModalOpen && (
                <Modal
                    title={editingSchedule ? "Edit Job" : "Add Job"}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingSchedule(null);
                    }}
                >
                    <EditForm
                        schedule={editingSchedule}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setEditingSchedule(null);
                        }}
                        onSave={(data) => handleSave(data, !!editingSchedule)}
                    />
                </Modal>
            )}
        </div>
    );
}

// ---------------- EditForm ----------------
function EditForm({ schedule, onCancel, onSave }) {
    const timezoneList = [
        "UTC",
        "Asia/Taipei",
        "Asia/Kolkata",
        "Europe/London",
        "America/New_York",
        "America/Los_Angeles",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Australia/Sydney",
    ];

    const parseCrontab = (crontab = "") => {
        const tzMatch = crontab.match(/CRON_TZ=([^\s]+)/);
        const timezone = tzMatch ? tzMatch[1] : "";
        const cleaned = crontab.replace(/CRON_TZ=[^\s]+\s*/, "");
        const parts = cleaned.trim().split(" ");
        return {
            timezone,
            minute: parts[0] || "",
            hour: parts[1] || "",
            day: parts[2] || "",
            month: parts[3] || "",
            week: parts[4] || "",
        };
    };

    const formatCrontab = ({ timezone, minute, hour, day, month, week }) => {
        return `CRON_TZ=${timezone || "UTC"} ${minute || "*"} ${hour || "*"} ${day || "*"
            } ${month || "*"} ${week || "*"}`;
    };

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        type: "",
        timezone: "",
        minute: "",
        hour: "",
        day: "",
        month: "",
        week: "",
        actionType: "",
        adminState: "",
    });

    useEffect(() => {
        if (schedule) {
            const cron = parseCrontab(schedule.definition?.crontab || "");
            setFormData({
                id: schedule.id || "",
                name: schedule.name || "",
                type: schedule.definition?.type || "",
                timezone: cron.timezone,
                minute: cron.minute,
                hour: cron.hour,
                day: cron.day,
                month: cron.month,
                week: cron.week,
                actionType: schedule.actions?.[0]?.type || "",
                adminState: schedule.adminState || "",
            });
        } else {
            setFormData({
                id: "",
                name: "",
                type: "",
                timezone: "",
                minute: "",
                hour: "",
                day: "",
                month: "",
                week: "",
                actionType: "",
                adminState: "",
            });
        }
    }, [schedule]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const crontab = formatCrontab(formData);
        onSave({ ...formData, crontab }, !!schedule);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label className="label">Name</label>
            <input
                className="form-control settings-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Job Name"
                required
            />

            <label className="label">Type</label>
            <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-control settings-input"
            >
                <option value="">-- Select Type --</option>
                <option value="CRON">CRON</option>
                <option value="INTERVAL">INTERVAL</option>
            </select>

            <label className="label">Timezone</label>
            <select
                name="timezone"
                className="form-control settings-input"
                value={formData.timezone}
                onChange={handleChange}
            >
                <option value="">-- Select Timezone --</option>
                {timezoneList.map((tz) => (
                    <option key={tz} value={tz}>
                        {tz}
                    </option>
                ))}
            </select>

            <label className="label">Minute</label>
            <input
                type="text"
                className="form-control settings-input"
                name="minute"
                value={formData.minute}
                onChange={handleChange}
                placeholder="*"
            />

            <label className="label">Hour</label>
            <input
                type="text"
                className="form-control settings-input"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                placeholder="*"
            />

            <label className="label">Day </label>
            <input
                type="text"
                className="form-control settings-input"
                name="day"
                value={formData.day}
                onChange={handleChange}
                placeholder="Example sun=1, mon=2, tue=3, wed=4, thu=5, fri=6, sat=7
"
            />

            <label className="label">Month</label>
            <input
                type="text"
                className="form-control settings-input"
                name="month"
                value={formData.month}
                onChange={handleChange}
                placeholder="*"
            />

            <label className="label">Week</label>
            <input
                type="text"
                className="form-control settings-input"
                name="week"
                value={formData.week}
                onChange={handleChange}
                placeholder="*"
            />

            <label className="label">Action Type</label>
            <select
                name="actionType"
                className="form-control settings-input"
                value={formData.actionType}
                onChange={handleChange}
            >
                <option value="">-- Select Action --</option>
                <option value="REST">REST</option>
                <option value="MQTT">MQTT</option>
                <option value="EMAIL">EMAIL</option>
            </select>

            <label className="label">Admin State</label>
            <select
                name="adminState"
                className="form-control settings-input"
                value={formData.adminState}
                onChange={handleChange}
            >
                <option value="">-- Select State --</option>
                <option value="UNLOCKED">UNLOCKED</option>
                <option value="LOCKED">LOCKED</option>
            </select>

            <div className="form-actions">
                <button type="submit" className="btn-secondary">
                    {schedule ? "Update" : "Add"}
                </button>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default Scheduler;