import React from 'react';
import { Link } from "react-router-dom";
import './NotificationCard.scss';
import AlertIcon from '../../assests/images/alert-icon.svg';
import ConfirmationIcon from '../../assests/images/confirmation.svg';
import NotificationIcon from '../../assests/images/notification-header.svg';

const NotificationCard = (props) => {
    let icon = NotificationIcon;
    let color = '#1969BF';

    const Wrapper = props.link ? Link : 'div';
    const wrapperProps = props.link ? { to: props.link } : {};

    switch (props.type) {
        case "confirmation":
          icon = ConfirmationIcon;
          color = "#48AE6D";
          break;
    
        case "alert":
          icon = AlertIcon;
          color = "#FF7A7A";
          break;
    
        case "information":
          icon = NotificationIcon;
          color = "#1969BF";
          break;
    
        default:          
          break;
      }

  return (
    <Wrapper className='notifcation-card' {...wrapperProps}>
        <div className='notifcation-card-inner' style={{borderColor: color}}>
            <div className='notifcation-card-icon'>
                <img src={icon} alt='Icon' />
            </div>
            <div className='notifcation-card-content'>
                <h4>{props.title}</h4>
                <p>{props.description}</p>
                <div className='notification-time'>
                  <div className='noti-time'>{props.time}</div>
                  {props.actions &&<div className='noti-actions'>
                    {props.actions.map((item) => (
                      <button type='button' className='btn-primary'>{item}</button>
                    ))}
                    </div>}
                </div>
            </div>
        </div>
    </Wrapper>
  )
}

export default NotificationCard