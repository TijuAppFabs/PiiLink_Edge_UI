import React from 'react';
import './Alerts.scss';
import NotificationCard from '../../components/NotificationCard';
import Title from '../../components/Title';

const ALERTS_DUMMY = [
    {
      title: "Device 1 Offline",
      description: "Gateway sensor has lost connection",
      timeAgo: "2 minute ago",
      actions: ["Acknowledge", "Resolve"]
    },
    {
      title: "High CPU Usage",
      description: "Device 2 showing elevated CPU usage (85%)",
      timeAgo: "2 minute ago",
      actions: ["Acknowledge", "Resolve"]
    },
    {
        title: "Low Disk Space",
        description: "Server 3 has less than 10% storage remaining",
        timeAgo: "5 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Temperature Warning",
        description: "Device 4 internal temperature exceeds 75°C",
        timeAgo: "10 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Network Latency",
        description: "Device 5 experiencing high network latency",
        timeAgo: "15 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Memory Usage High",
        description: "Device 6 memory usage has reached 90%",
        timeAgo: "20 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Battery Low",
        description: "Device 7 battery level below 15%",
        timeAgo: "25 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Sensor Error",
        description: "Device 8 temperature sensor malfunction detected",
        timeAgo: "30 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Unauthorized Access",
        description: "Multiple failed login attempts detected on Device 9",
        timeAgo: "35 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      },
      {
        title: "Firmware Update Available",
        description: "Device 10 has a pending firmware update",
        timeAgo: "40 minutes ago",
        actions: ["Acknowledge", "Resolve"]
      }
  ];
  

const Alerts = () => {
  return (
    <>
         <Title 
            title="Active Alert"
        />
        <div className='alert-page-wrapper'>
            {ALERTS_DUMMY.map((alert) => (
                <div className='alert-item'>
                    <NotificationCard
                        title={alert.title}
                        description={alert.description}
                        type="alert"
                        time={alert.timeAgo}
                        actions={alert.actions}
                    />
                </div>
            ))}  
            
        </div>
    </>
  )
}

export default Alerts