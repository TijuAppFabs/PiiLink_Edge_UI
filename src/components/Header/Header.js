import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Header.scss';
import Logo from '../../assests/images/logo-expanded.svg';
import LogoCollapsed from '../../assests/images/logo-collapsed.svg';
import ToggleIcon from '../../assests/images/back.png';
import Refresh from '../../assests/images/refresh.svg';
import Notifications from '../../assests/images/notifications.svg';
import ArrowDown from '../../assests/images/arrow-down.svg';
import NotificationCard from "../NotificationCard";

const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showNProfileDown, setShowNProfileDown] = useState(false);
    const [navToggle, setNavToggle] = useState(false);
    const [isTab, setIsTab] = useState(window.innerWidth <= 769);

    useEffect(() => {
        const handleResize = () => {
            setIsTab(window.innerWidth <= 769);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    useEffect(() => {
        if (isTab) {
            document.body.classList.add('toggle-active');
            setNavToggle(true);
            const alertElement = document.querySelector('.sidebar-wrapper .alert-body');
            alertElement.style.display = 'none';
        } else {
            document.body.classList.remove('toggle-active');
            setNavToggle(false);
        }
    }, [isTab]);
    

    const notificationDropdownHandler = () => {
        setShowNotifications((prev) => !prev);
    }
    const profileDropdownHandler = () => {
        setShowNProfileDown((prev) => !prev);
    }
    const toggleHandler = () => {
        setNavToggle((prev) => !prev)
        const isToggle = document.body.classList.toggle('toggle-active');
        const alertElement = document.querySelector('.sidebar-wrapper .alert-body');
        if (alertElement) {
            if (isToggle) {
                alertElement.style.display = 'none';
            } else {
                setTimeout(() => {
                    alertElement.style.display = '';
                }, 400);            
            }
        }
    }
    return (
        <header>
            <nav className="nav-bar">
                {/*<div className={`nav-brand-with-toggle ${navToggle ? 'toggled' : ''}`} >*/}
                <div className="nav-brand-with-toggle">
                    <Link to="/" className="d-flex">
                    {console.log('navToggle', navToggle)}
                        {!navToggle ? <>
                            <img src={Logo} alt="Logo" className="logo-expanded desktop" /><img src={LogoCollapsed} alt="Logo" className="logo-expanded mobile" />
                        </> :
                        <img src={LogoCollapsed} alt="Logo" className="logo-collapsed" />}
                    </Link>
                    <button type="button" className="no-btn nav-toggle-btn" onClick={toggleHandler}>
                        <img src={ToggleIcon} alt="Toggle Navbar" />
                    </button>
                </div>
                <div className="data-status-with-reload">
                    <div className="data-status">Live Data</div>
                    <button type="button" className="reload-btn">
                        <span>Auto refresh:30s</span>
                        <img src={Refresh} alt="Reload" />
                    </button>
                </div>
                <div className="nav-profile">
                    <div className="notification-wrapper">
                        <button type="button" className="notification-btn no-btn" onClick={notificationDropdownHandler}>
                            <img alt="Notifications Button" src={Notifications} />
                        </button>
                        {showNotifications && <div className="notification-dropdown">
                            <div className="notification-wrappe">
                                <NotificationCard 
                                    title="Device Connection Lost"
                                    description="Temperature sensor (ID:TS-001) has lost connection"
                                    time="2 minute ago"
                                    type="alert"
                                    link="/"
                                />
                                <NotificationCard 
                                    title="High Temperature Alert"
                                    description="Sensor reading exceeded threshold:85°"
                                    time="1 hours ago"
                                    type="alert"
                                    link="/"
                                />
                                <NotificationCard 
                                    title="New Device added"
                                    description="Humidity sensor(ID: HS-012) added to network"
                                    time="1 day ago"
                                    type="confirmation"
                                    link="/"
                                />
                                <NotificationCard 
                                    title="System update available"
                                    description="New firmware update available for download"
                                    time="1 day ago"
                                    type="information"
                                    link="/"
                                />
                                <div className="notification-footer">
                                    <button className="btn-link-primary">View all </button>
                                </div>                                
                            </div>
                        </div>}
                    </div>
                    <div className="profile-dropdown">
                        <button type="button" className="nav-profile-btn no-btn" onClick={profileDropdownHandler}>
                            <div>
                                Admin<span>12:54 Pm</span>
                            </div>
                            <img src={ArrowDown} alt="Icon" style={{ transform: showNProfileDown ? 'scaleY(-1)' : 'scaleY(1)' }} />
                        </button>
                        {showNProfileDown && <div className="profile-dropdown-wrapper">
                            <button type="button" className="btn-link-primary">Logout</button>
                        </div>}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;