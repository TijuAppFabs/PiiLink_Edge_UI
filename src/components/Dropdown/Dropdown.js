import React from 'react';
import './Dropdown.scss';

const Dropdown = () => {
  return (
    <div className='dropdown'>
        <ul>
            <li>
                <input type='text' placeholder='Search' className='form-control' />
            </li>
            <li>
                <label>
                    <input type="checkbox" className='checkbox' />
                    <span>Pending</span>
                </label>
            </li>
            <li>
                <label>
                    <input type="checkbox" className='checkbox' />
                    <span>Failed</span>
                </label>
            </li>
            <li>
                <label>
                    <input type="checkbox" className='checkbox' />
                    <span>Success</span>
                </label>
            </li>
        </ul>
    </div>
  )
}

export default Dropdown