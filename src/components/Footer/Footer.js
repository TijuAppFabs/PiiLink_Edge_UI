import './Footer.scss';

const Footer = () => {
    return <footer className='footer'>
        <div className='footer-row'>
            <div className='status-summary-items'>
                <div className='status-summary-item online'>Online</div>
                <div className='status-summary-item offline'>Offline</div>
                <div className='status-summary-item busy'>Alarm</div>
            </div>
            <div className='last-updated'>Last updated : 12:05:12 pm</div>
        </div>
    </footer>
}

export default Footer;