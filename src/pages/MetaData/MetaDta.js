import React, { useState } from 'react';
import './MetaData.scss';
import Title from '../../components/Title';
import SectionTabs from '../../components/SectionTabs';
import PageCard from '../../components/PageCard';
import DeviceService from './DeviceService';
import Device from './Device';
import DeviceProfile from './DeviceProfile';
import ProvisionWatcher from './ProvisionWatcher';

const TAB_HEADING = [
    { id: 'deviceService', label: 'Device Service' },
    { id: 'device', label: 'Device' },
    { id: 'deviceProfile', label: 'Device Profile' },
    { id: 'provisionWatcher', label: 'Provision Watcher' }
  ];  

const MetaDta = () => {
    const [activeTab, setActiveTab] = useState(TAB_HEADING[0].id);

    const renderContent = () => {
        switch (activeTab) {
          case 'deviceService':
            return <DeviceService />;
          case 'device':
            return <Device />;
          case 'deviceProfile':
            return <DeviceProfile />;
          case 'provisionWatcher':
            return <ProvisionWatcher />;
          default:
            return null;
        }
    };

    return (
        <>
            <Title 
                title="Metadata Management"
                description="Configure devices services, profiles and system metadata"
            />
            <SectionTabs 
                tabs={TAB_HEADING}
                activeTab={activeTab}
                onTabClick={(id) => setActiveTab(id)}
             />
            <PageCard>
                {renderContent()}
            </PageCard>
        </>
    )
}
export default MetaDta;