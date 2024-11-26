import React, { useEffect, useState } from 'react';
import { Settings } from '../../types';
import BlockedSites from './BlockedSites';
import Schedules from './Schedules';
import Customize from './Customize';

const DEFAULT_SETTINGS: Settings = {
  blockedSites: [],
  schedules: [],
  customBlockPage: {
    title: 'Site Blocked',
    message: 'This site is currently blocked',
    backgroundColor: '#f8f9fa',
    textColor: '#212529'
  },
  isEnabled: true
};

const Popup: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState('sites');

  useEffect(() => {
    // Load settings when popup opens
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
      if (response.settings) {
        setSettings(response.settings);
      }
    });
  }, []);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: newSettings
    });
  };

  const handleEnableChange = (enabled: boolean) => {
    const newSettings = { ...settings, isEnabled: enabled };
    handleSettingsChange(newSettings);
  };

  return (
    <div className="container-fluid">
      <h4 className="mb-3">Site Blocker Pro</h4>
      
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="enableExtension"
          checked={settings.isEnabled}
          onChange={(e) => handleEnableChange(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="enableExtension">
          Enable Blocking
        </label>
      </div>

      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'sites' ? 'active' : ''}`}
            onClick={() => setActiveTab('sites')}
          >
            Blocked Sites
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            Schedules
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'customize' ? 'active' : ''}`}
            onClick={() => setActiveTab('customize')}
          >
            Customize
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'sites' && (
          <BlockedSites
            sites={settings.blockedSites}
            onChange={(sites) => handleSettingsChange({ ...settings, blockedSites: sites })}
          />
        )}
        {activeTab === 'schedules' && (
          <Schedules
            schedules={settings.schedules}
            onChange={(schedules) => handleSettingsChange({ ...settings, schedules })}
          />
        )}
        {activeTab === 'customize' && (
          <Customize
            customBlockPage={settings.customBlockPage}
            onChange={(customBlockPage) => handleSettingsChange({ ...settings, customBlockPage })}
          />
        )}
      </div>
    </div>
  );
};

export default Popup;
