import React from 'react';
import './PageCard.scss';

const PageCard = (props) => {
    return (
        <div className="page-card">
            {props.children}
        </div>
    );
};

export default PageCard;