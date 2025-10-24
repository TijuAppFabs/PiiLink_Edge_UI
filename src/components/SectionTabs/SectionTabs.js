import React from 'react';
import './SectionTabs.scss';

const SectionTabs = ({ tabs, activeTab, onTabClick, version }) => {

    return (
        <div className={`section-tabs ${version ? version : ''}`}>
          {tabs.map((item) => (
            <button type='button'
              key={item.id}
              className={`section-tab-btn ${item.id === activeTab ? 'active' : ''}`}
              onClick={() => onTabClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      );
};

export default SectionTabs;