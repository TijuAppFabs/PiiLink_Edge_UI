import React, { useState, useEffect } from "react";
// import "./Devicerimary.scss"
function DevicePrimary({ formValues = {}, setFormValues }) {
  const [localValues, setLocalValues] = useState({
    name: "",
    description: "",
    labels: "",
    adminState: "",
    ...formValues, // merge parent values
  });

  useEffect(() => {
    setLocalValues((prev) => ({ ...prev, ...formValues }));
  }, [formValues]);

  // Update local instantly
  const handleChange = (field, value) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
  };

  // Push local state back to parent when user leaves field
  const handleBlur = () => {
    setFormValues((prev) => ({ ...prev, ...localValues }));
  };

  return (
    <div className="steps-body-item">
      <form className="form">
        <div className="form-controls">
          <div className="form-control-item">
            <label className="label">
              Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control settings-input"
              value={localValues.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={handleBlur}
            />
          </div>

          <div className="form-control-item">
            <label className="label">Description</label>
            <textarea
              className="form-control settings-input"
              rows="2"
              value={localValues.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={handleBlur}
            />
          </div>

          <div className="form-control-item">
            <label className="label">Labels</label>
            <input
              type="text"
              className="form-control settings-input"
              value={localValues.labels || ""}
              onChange={(e) => handleChange("labels", e.target.value)}
              onBlur={handleBlur}
            />
          </div>

          <div className="form-control-item">
  <label className="label">
    Admin state<span style={{ color: "red" }}>*</span>
  </label>
  <div className="input-radio-row">
    <label className="radio-switch">
      <input
        type="radio"
        name="adminState"
        checked={localValues.adminState === "Unlocked"}
        onChange={() => handleChange("adminState", "Unlocked")}
        onBlur={handleBlur}
      />
      <span className="radio-switch-icon"></span>
      <span className="radio-switch-label">Unlocked</span>
    </label>
    <label className="radio-switch">
      <input
        type="radio"
        name="adminState"
        checked={localValues.adminState === "Locked"}
        onChange={() => handleChange("adminState", "Locked")}
        onBlur={handleBlur}
      />
      <span className="radio-switch-icon"></span>
      <span className="radio-switch-label">Locked</span>
    </label>
  </div>
</div>

        </div>
      </form>
    </div>
  );
}

export default DevicePrimary;