import React from 'react';
import './Card.scss';
import Tag from '../Tag';

const Card = (props) => {
    return (
        <div
            className="dash-card"
            onClick={props.onClick}                     
            style={{ cursor: props.onClick ? "pointer" : "default" }} 
        >
            <div className="dash-card-inner">
                <img src={props.icon} className='dash-card-icon' alt='Icon' />
                <h3>{props.title}</h3>
                <div className="card-value">
                    <div className='text-value'>{props.value}</div>
                    {props.progress && (
                        <div className='progress-bar'>
                            <div
                                className="progress-bar-status"
                                style={{ width: `${props.progress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
                <div className='dash-card-status'>
                    <Tag type={props.type} color={props.subtitleColor}>
                        {props.subtitle}
                    </Tag>
                </div>
            </div>
        </div>
    );
};

export default Card;