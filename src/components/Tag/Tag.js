import React from 'react';
import './Tag.scss';
const Tag = (props) => {
    return (
        <div className={['tag', props.type, props.color].filter(Boolean).join(' ')}>
            {props.children}
        </div>
    );
};

export default Tag;