import React from 'react';
import './Title.scss';

const Title = ({title, description}) => {
    return (
        <div className='page-title'>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
        </div>
    );
};

export default Title;