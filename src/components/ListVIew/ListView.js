import React, { useState } from 'react';
import './ListView.scss';
import Tag from '../Tag/Tag';
import Lock from '../../assests/images/Lock.svg';
import Unlock from '../../assests/images/unloacked.svg';
import AssociatedIcon from '../../assests/images/associated.svg';
import EyeIcon from '../../assests/images/Eye.svg';
import CodeIcon from '../../assests/images/Code.svg';
import { FiSettings } from "react-icons/fi";

const LOCKED = 'Locked';
const UNLOCKED = 'Unlocked';
const HIDE_DETAILS_SERVICES = ["device-rest", "device-virtual", "device-opcua"];

const ListView = ({
  data: initialData,
  icon,
  viewType = "default",
  selectedIds = [],
  onRowClick = () => { } // Default to no-op function
}) => {
  const [devices, setDevices] = useState(initialData);
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(null);
  const [formData, setFormData] = useState({ description: '', status: UNLOCKED });

  const toggleSettings = (index) => {
    if (activeDeviceIndex === index) {
      setActiveDeviceIndex(null);
    } else {
      setActiveDeviceIndex(index);
      setFormData({
        description: devices[index].description || '',
        status: devices[index].status || UNLOCKED
      });
    }
  };

  const handleSave = (index) => {
    const updatedDevices = devices.map((device, i) =>
      i === index ? { ...device, description: formData.description, status: formData.status } : device
    );
    setDevices(updatedDevices);
    setActiveDeviceIndex(null);
  };

  return (
    <>
      <div className='list-view-items'>
        {devices.map((item, index) => {
          const shouldHideDetails = HIDE_DETAILS_SERVICES.includes(item.name);
          const isSelected = selectedIds.includes(item.id);

          // 👉 Scheduler page layout
          if (viewType === "scheduler") {
            return (
              <div
                key={index}
                className={`scheduler-card ${isSelected ? "active" : ""}`}
                onClick={() => onRowClick(item.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="scheduler-left">
                  <img src={icon} alt="scheduler" className="scheduler-icon" />
                </div>
                <div className="scheduler-middle">
                  <h4 className="scheduler-name">{item.name}</h4>
                  <p className="scheduler-sub">
                    <span>ID:</span> {item.id} &nbsp;|&nbsp;
                    <span>Type:</span> {item.type} &nbsp;|&nbsp;
                    <span>Crontab:</span> {item.crontab}
                  </p>
                </div>
                <div className="scheduler-right">
                  <Tag type="pillow" color={item.status === LOCKED ? 'locked' : 'green'}>
                    <div className='d-flex' style={{ gap: '6px' }}>
                      <img src={item.status === LOCKED ? Lock : Unlock} alt='Status' />
                      <span>{item.status}</span>
                    </div>
                  </Tag>
                </div>
              </div>
            );
          }


          // 👉 DeviceProfile custom layout
          if (viewType === "deviceProfile") {
            return (
              <div
                key={index}
                className={`list-view-item${isSelected ? " selected" : ""}`}
                onClick={() => onRowClick(item.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="list-view-item-icon">
                  <img src={icon} alt="Device" />
                </div>
                <div className="list-view-item-content">
                  <div className="list-view-item-informations">
                    <div className="list-view-header">
                      <h3>{item.name}</h3>
                    </div>

                    <div className="device-description device-info-row">
                      {/* <p><strong>ID:</strong> {item.id}</p> */}
                      {/* <p>Description:{item.description}</p> */}
                    </div>

                    <div className="device-description device-info-row">
                      <p>Manufacturer: {item.crontab}</p>
                      <p>Model: {item.type}</p>
                      <p>Labels:{item.labels}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }


          // 👉 Default ListView (devices & services)
          return (
            <div
              key={index}
              className={`list-view-item${isSelected ? ' selected' : ''}`}
              onClick={() => onRowClick(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className='list-view-item-icon'>
                <img src={icon} alt='Icon' />
              </div>
              <div className='list-view-item-content'>
                <div className='list-view-item-informations'>
                  <div className='list-view-header'>
                    <h3>{item.name}</h3>
                    <div className='d-flex' style={{ gap: '7px' }}>
                      <Tag type="pillow" color={item.status === LOCKED ? 'locked' : 'green'}>
                        <div className='d-flex' style={{ gap: '6px' }}>
                          <img src={item.status === LOCKED ? Lock : Unlock} alt='Status' />
                          <span>{item.status}</span>
                        </div>
                      </Tag>
                      <Tag type="pillow" color="antiquewhite">
                        <div className='d-flex' style={{ gap: '6px' }}>
                          <img src={AssociatedIcon} alt='Associated' />
                          <span>{item.associatedCount} Associated</span>
                        </div>
                      </Tag>
                    </div>
                  </div>
                  <div className='device-description'>
                    port: {item.url}:{item.port} <br />
                    {item.description && <span>Description: {item.description}</span>}
                  </div>

                  {!shouldHideDetails && (
                    <div className='device-status-row'>
                      <div className='device-status-item'>Operating status: {item.operatingStatus}</div>
                      <div className='device-status-item'>Last Connected on {item.lastConnected}</div>
                      <div className='device-status-item'>Last Reported on {item.lastReported}</div>
                    </div>
                  )}
                </div>

                <div className='list-view-item-actions'>
                  {!shouldHideDetails && (
                    <>
                      <button className='btn-primary'>
                        <img src={CodeIcon} alt='Command' />
                        <span>Command</span>
                      </button>
                      <button type='button' className='btn-primary'>
                        <img src={EyeIcon} alt='View' />
                      </button>
                    </>
                  )}

                  {shouldHideDetails && (
                    <button className='btn-secondary d-flex' onClick={() => toggleSettings(index)} style={{ alignItems: "center", gap: "6px" }}>
                      <FiSettings size={18} />
                      <span>Settings</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEPARATE SETTINGS CONTAINER BELOW THE LIST */}
      {activeDeviceIndex !== null && viewType !== "scheduler" && (
        <div className='settings-details-container'>
          <h3>Device Settings: {devices[activeDeviceIndex].name}</h3>
          <div className='settings-form'>
            <label className="label">Description:</label>
            <input
              type='text' className='form-control'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder='Enter description'
            />
            <label className="label">Status:</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value={UNLOCKED} className="label">{UNLOCKED}</option>
              <option value={LOCKED} className="label">{LOCKED}</option>
            </select>
            <button className='btn-secondary' onClick={() => handleSave(activeDeviceIndex)}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListView;
