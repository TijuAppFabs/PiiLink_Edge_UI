import React, { useState } from 'react';
import './TableTopActions.scss';
import FilterIcon from '../../assests/images/filter-lines.svg';
import ListIcon from '../../assests/images/list-view.svg';
import TableIcon from '../../assests/images/table-view.svg';
import ListActiveIcon from '../../assests/images/list-view-active.svg';
import TableActiveIcon from '../../assests/images/table-view-active.svg';
import Dropdown from '../Dropdown';

const TableTopActions = (props) => {
    const [isShowDropdown, setIsShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setIsShowDropdown((prev) => !prev);
    };

    return (
        <div className='table-top-actions'>
            {/* Show filter only if allowed */}
            {props.showFilter !== false && (
                <div className='with-dropdown'>
                    <button
                        type='button'
                        className='filter-btn no-btn'
                        onClick={toggleDropdown}
                    >
                        <img src={FilterIcon} alt='Icon' />
                        <span>Filter</span>
                    </button>
                    {isShowDropdown && <Dropdown />}
                </div>
            )}

            <button
                type='button'
                className='table-view-switch no-btn'
                onClick={() => props.handleView(true)}
            >
                {props.isListView ? (
                    <img src={ListActiveIcon} alt='Icon' />
                ) : (
                    <img src={ListIcon} alt='Icon' />
                )}
            </button>

            <button
                type='button'
                className='table-view-switch no-btn'
                onClick={() => props.handleView(false)}
            >
                {props.isListView ? (
                    <img src={TableIcon} alt='Icon' />
                ) : (
                    <img src={TableActiveIcon} alt='Icon' />
                )}
            </button>
        </div>
    );
};

export default TableTopActions;