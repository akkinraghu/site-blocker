import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { ShieldExclamationIcon, ClockIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import BlockedSites from './BlockedSites';
import Schedules from './Schedules';
import Customize from './Customize';

interface Settings {
  isEnabled: boolean;
  customBlockPage: boolean;
  [key: string]: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Popup: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    isEnabled: true,
    customBlockPage: false
  });

  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setIsEnabled(result.settings.isEnabled);
        setSettings(result.settings);
      }
    });
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || {};
      chrome.storage.sync.set({
        settings: { ...settings, isEnabled: newState }
      });
    });
  };

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    chrome.storage.sync.get(['settings'], (result) => {
      const settings = result.settings || {};
      chrome.storage.sync.set({
        settings: { ...settings, ...newSettings }
      });
      setSettings(prev => ({ ...prev, ...newSettings }));
    });
  };

  return (
    <div className="w-[400px] min-h-[500px] p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Blocker</h1>
          <p className="text-sm text-gray-500 mt-1">Block distracting websites</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {[
            { name: 'Blocked Sites', icon: ShieldExclamationIcon },
            { name: 'Schedules', icon: ClockIcon },
            { name: 'Customize', icon: PaintBrushIcon }
          ].map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-primary-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-700'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-4',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2'
            )}
          >
            <BlockedSites />
          </Tab.Panel>

          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-4',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2'
            )}
          >
            <Schedules />
          </Tab.Panel>

          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-4',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2'
            )}
          >
            <Customize
              customBlockPage={settings.customBlockPage}
              onChange={(customBlockPage) =>
                handleSettingsChange({ customBlockPage })
              }
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Popup;
