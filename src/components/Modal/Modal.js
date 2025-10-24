import React from 'react';
import './Modal.scss';
import CloseIcon from '../../assests/images/times.svg';

const Modal = (props) => {
  return (
    <>
        <div className='backdrop' onClick={props.onClose}></div>
        <div className='modal-wrapper'>
            <div className='modal-header'>
                <h3>
                    {props.title}
                </h3>
                <button type='btton' className='close-modal' onClick={props.onClose}>
                    <img src={CloseIcon} alt='Close modal'/>
                </button>
            </div> 
            <div className='modal-body'>
                <div className='modal-body-inner'>
                    {props.children}
                </div>
            </div>           
        </div>
    </>
  )
}

export default Modal