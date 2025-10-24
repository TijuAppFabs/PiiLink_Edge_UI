import React from "react";
import { Link, NavLink } from "react-router-dom";
import './sidebar.scss';
import DashIcon from '../../assests/images/dashboard-icon.svg';
import DashIconActive from '../../assests/images/dashboard-icon-active.svg';
import MetaIcon from '../../assests/images/meta-icon.svg';
import MetaIconActive from '../../assests/images/meta-icon-active.svg';
import DataIcon from '../../assests/images/data-center-icon.svg';
import DataIconActive from '../../assests/images/data-center-icon-active.svg';
import SchedularIcon from '../../assests/images/scheduler-icon.svg';
import SchedulerIconActive from '../../assests/images/scheduler-icon-active.svg';
import NotiicationIcon from '../../assests/images/notification-sidebar-icon.svg';
import NotificationIconActive from '../../assests/images/notification-sidebar-icon-active.svg';
import RuleIcon from '../../assests/images/setting-2.svg';
import RuleIconActive from '../../assests/images/setting-2-active.svg';
import AppService from '../../assests/images/app-store.svg';
import AppServiceActive from '../../assests/images/app-store-active.svg';
import AlertIcon from '../../assests/images/lamp-on.svg';

const Sidebar = () => {
    return (
        <div className="sidebar-wrapper">
            <ul className="sidebar-navigation">
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? DashIconActive : DashIcon} alt="Icon" />
                            <span>Dashboard</span>
                        </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/meta-data" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? MetaIconActive : MetaIcon} alt="Icon" />
                            <span>Meta Data</span>
                        </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/data-center" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? DataIconActive : DataIcon} alt="Icon" />
                            <span>Data Center</span>
                        </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/scheduler" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? SchedulerIconActive : SchedularIcon} alt="Icon" />
                            <span>Scheduler</span>
                        </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notification" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? NotificationIconActive : NotiicationIcon} alt="Icon" />
                            <span>Notification</span>
                        </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/rule-engine" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? RuleIconActive : RuleIcon} alt="Icon" />
                            <span>Rule Engine</span>
                        </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/app-service" className={({ isActive }) => (isActive ? "active" : "")}>
                        {({ isActive }) => (
                        <>
                            <img src={isActive ? AppServiceActive : AppService} alt="Icon" />
                            <span>App Service</span>
                        </>
                        )}
                    </NavLink>
                </li>

            </ul>
            <div className="alert-message-sidebar">
                <div className="alert-header">
                    <Link to="/alerts" className="alert-header-icon">
                        <img src={AlertIcon} alt="Alert Icon" />
                        <div className="shadow-box"></div>
                        <div className="alert-count">2</div>
                    </Link>
                </div>
                <div className="alert-body">
                    <h5>Active Alert</h5>
                    <p>There are alerts on <strong>2</strong> devices. Please look into it and take necessary action.</p>
                    <Link to="/alerts" className="btn-bg-white">Check device alert</Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;