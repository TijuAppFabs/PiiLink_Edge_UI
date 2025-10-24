import React from 'react';
import './AuthLayout.scss';
import Logo from '../../assests/images/logo-collapsed.svg';

const AuthLayout = (props) => {
  return (
    <div className='app-login-wrapper'>
        <div className='app-login-start'>
          <div className='app-login-content'>
            <img src={Logo} alt='Pie Device' />
              <h2>Pie Device</h2>
              <p>The most popular Device Management system</p>
          </div>
        </div>
        <div className='app-login-end'>
          <div className='app-login-form'>
            <div className='app-login-form-desc'>
              <h3>Hello Admin!</h3>
              <p>Welcome Back</p>
            </div>
            <div className='app-form-card'>
              <form>
                <div className='form-control-item'>
                  <input type='email' className='form-control' placeholder='Email Address' />
                </div>
                <div className='form-control-item'>
                  <input type='password' className='form-control' placeholder='Password' />
                </div>
                <div className='form-control-item'>
                  <button type='button' className='btn-secondary btn-lg' onClick={props.handleLoginTemp}>Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AuthLayout